import { Container } from 'inversify';
import getDecorators from 'inversify-inject-decorators';

import { MultiProviderException, UnknownExportException } from '../errors';
import { ModuleContainer } from './container';
import { Reflector } from '../reflector';
import { Registry } from '../registry';
import { Utils } from '../util';
import {
  ClassProvider,
  FactoryProvider,
  ModuleExport,
  ModuleImport,
  OnModuleInit,
  Provider,
  Type,
  Token,
  ValueProvider,
  Dependency,
  MultiDepsProvider,
} from '../interfaces';
import {
  Injector,
  MODULE_INITIALIZER,
  MODULE_REF,
  PROVIDER_TYPES,
  SCOPE_METADATA,
  SCOPES,
} from '../constants';

export class Module {
  private readonly imports = new Set<Module>();
  public readonly providerContainer = new Set<Provider>();
  public readonly providers = new Container();
  public readonly lazyInject = getDecorators(this.providers).lazyInject;
  public readonly exports = new Set<Token>();

  constructor(
    public readonly target: Type<any>,
    public readonly scope: Type<any>[],
    private readonly container: ModuleContainer,
  ) {}

  public addImport(relatedModule: Module) {
    this.imports.add(relatedModule);
  }

  public addProvider(provider: Provider) {
    this.providerContainer.add(provider);
  }

  private validateExported(token: Token, exported: ModuleExport) {
    if (this.providerContainer.has(exported)) return token;

    const imported = [...this.imports.values()];
    const importedRefNames = <any[]>imported
      .filter(item => item)
      .map(({ target }) => target)
      .filter(target => target);

    if (!importedRefNames.includes(token)) {
      throw new UnknownExportException(
        this.target.name,
        (<Type<any>>exported).name,
      );
    }

    return token;
  }

  public addExported(exported: ModuleImport) {
    const addExportedUnit = (token: Token) =>
      this.exports.add(this.validateExported(token, <any>exported));

    /*if (Registry.isProvideToken(exported)) {
      return addExportedUnit(Registry.getProviderName(exported));
    } else */ if (
      Registry.isDynamicModule(exported)
    ) {
      return addExportedUnit(exported.module);
    }

    addExportedUnit(Registry.getProviderToken(<Type<any>>exported));
  }

  public getProviders() {
    return [
      ...this.providerContainer.values(),
      ...this.getRelatedProviders().values(),
    ];
  }

  private linkRelatedProviders() {
    const providers = [...this.getRelatedProviders().values()];

    providers.forEach(provider => {
      const ref = this.container.getProvider(provider);

      this.providers.bind(<any>provider).toConstantValue(ref);
    });
  }

  private getRelatedProviders() {
    const providerScope = new Set<Token>();

    const find = (module: Module | Dependency) => {
      module = <any>Registry.getForwardRef(<Dependency>module);

      if (Reflector.isProvider(<any>module)) {
        providerScope.add(<Token>module);
      } else {
        for (const related of (<Module>module).exports.values()) {
          if (this.container.hasModuleRef(<Type<Module>>related)) {
            const ref = this.container.getModuleRef(<Type<Module>>related);
            find(ref!);
          } else {
            providerScope.add(<Token>related);
          }
        }
      }
    };

    for (const related of this.imports.values()) {
      find(related);
    }

    return providerScope;
  }

  private async bindProviders() {
    const providers = [...this.providerContainer.values()];

    this.linkRelatedProviders();

    for (const provider of providers) {
      const isMulti = (<MultiDepsProvider>provider).multi;
      const token = Registry.getProviderToken(provider);

      // @TODO: Fix multi providers properly
      if (!isMulti && this.container.providerTokens.includes(token)) {
        throw new MultiProviderException(provider);
      }

      this.container.providerTokens.push(token);
      const type = this.getProviderType(provider);
      await this.bind(token, type, provider);
    }
  }

  public async create() {
    if (this.providers.isBound(this.target)) return;

    this.providers.bind(this.target).toSelf();
    const module = this.providers.get<Type<Module>>(this.target);

    await this.bindProviders();

    (<OnModuleInit>module).onModuleInit &&
      (await (<OnModuleInit>module).onModuleInit());

    await Utils.series(
      this.container.getAllProviders<Promise<any>>(
        MODULE_INITIALIZER,
        this.target,
      ),
    );

    console.log(this.target.name, 'created');
  }

  private getProviderType(provider: Provider) {
    if (Registry.isFactoryProvider(provider)) {
      return PROVIDER_TYPES.FACTORY;
    } else if (Registry.isValueProvider(provider)) {
      return PROVIDER_TYPES.VALUE;
    } else if (Registry.isClassProvider(provider)) {
      return PROVIDER_TYPES.CLASS;
    } else if (Registry.isExistingProvider(provider)) {
      return PROVIDER_TYPES.EXISTING;
    }

    return PROVIDER_TYPES.DEFAULT;
  }

  private bindProvider(scope: string, provider: Type<any>) {
    const binding = this.providers.bind(provider).toSelf();

    switch (scope) {
      case SCOPES.TRANSIENT:
        return binding.inTransientScope();

      case SCOPES.REQUEST:
        return binding.inRequestScope();

      case SCOPES.SINGLETON:
      default:
        return binding.inSingletonScope();
    }
  }

  private bindClassProvider(token: Token, provider: ClassProvider) {
    return this.providers.bind(token).to(provider.useClass);
  }

  private bindValueProvider(token: Token, provider: ValueProvider<any>) {
    return this.providers.bind(token).toConstantValue(provider.useValue);
  }

  private async getDependencies(dependencies: ModuleImport[]) {
    const providers = this.getProviders();
    // Shouldn't resolve dependencies before the actual binding happens

    return await Promise.all(
      dependencies.map(dep => {
        const token = Registry.getForwardRef(dep);
        return this.container.getProvider(
          providers.find(provider => provider === token),
        );
      }),
    );
  }

  private async bindFactoryProvider(
    token: Token,
    provider: FactoryProvider<any>,
  ) {
    const deps = await this.getDependencies(provider.deps);

    // const factory = await provider.useFactory(...deps);
    if (provider.scope === SCOPES.TRANSIENT) {
      return this.providers
        .bind(token)
        .toDynamicValue(() => <any>provider.useFactory(...deps));
    }

    return this.providers
      .bind(token)
      .toProvider(() => <any>provider.useFactory(...deps));
  }

  private resolveProviderScope(provider: Type<Provider>) {
    return Reflect.getMetadata(SCOPE_METADATA, provider);
  }

  public async bind(token: Token, type: string, provider: Provider) {
    // @TODO: Add useExisting binding
    if (type === PROVIDER_TYPES.DEFAULT) {
      const scope = this.resolveProviderScope(<Type<Provider>>provider);
      const lazyInjects = Registry.getLazyInjects(<Type<Provider>>provider);
      lazyInjects.forEach(({ lazyInject, forwardRef }) => {
        const token = Registry.getForwardRef(forwardRef);
        lazyInject(this.lazyInject, <Token>token);
      });
      this.bindProvider(scope, <Type<Provider>>provider);
    } else if (type === PROVIDER_TYPES.FACTORY) {
      await this.bindFactoryProvider(token, <FactoryProvider<any>>provider);
    } else if (type === PROVIDER_TYPES.VALUE) {
      this.bindValueProvider(token, <ValueProvider<any>>provider);
    } else if (type === PROVIDER_TYPES.CLASS) {
      this.bindClassProvider(token, <ClassProvider>provider);
    }
  }

  public addGlobalProviders() {
    this.providers.bind(Injector).toConstantValue(this.providers);
    this.providers.bind(ModuleContainer).toConstantValue(this.container);
    this.providers.bind(MODULE_REF).toConstantValue(this);

    this.providers
      .bind(Injector)
      .toConstantValue(this.providers)
      .whenInjectedInto(this.target);

    this.providers
      .bind(ModuleContainer)
      .toConstantValue(this.container)
      .whenInjectedInto(this.target);
  }
}
