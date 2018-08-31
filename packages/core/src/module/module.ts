import { Container } from 'inversify';
import getDecorators from 'inversify-inject-decorators';

import { UnknownExportException } from '../errors';
import { ModuleContainer } from './container';
import { Registry } from '../registry';
import {
  ClassProvider,
  DynamicModule,
  FactoryProvider,
  ForwardRef,
  ModuleExport,
  ModuleImport,
  OnModuleInit,
  Provider,
  Type,
  ValueProvider,
} from '../interfaces';
import {
  Injector,
  MODULE_INITIALIZER,
  PROVIDER_TYPES,
  SCOPE,
  SCOPES,
} from '../constants';
import { Utils } from '@one/core';

type Token = Type<any> | symbol;

export class Module {
  private readonly relatedModules = new Set<Module>();
  public readonly providerContainer = new Set<Provider>();
  public readonly providers = new Container();
  public readonly lazyInject = getDecorators(this.providers).lazyInject;
  public readonly exports = new Set<Token>();

  constructor(
    public readonly target: Type<any>,
    public readonly scope: Type<any>[],
    private readonly container: ModuleContainer,
  ) {}

  public addRelatedModule(relatedModule: Module) {
    this.relatedModules.add(relatedModule);
  }

  public addProvider(provider: Provider) {
    this.providerContainer.add(provider);
    // const type = this.getProviderType(provider);
    // await this.bind(provider);
  }

  private validateExported(token: Token, exported: ModuleExport) {
    if (this.providerContainer.has(exported)) return token;

    const imported = [...this.relatedModules.values()];
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

  // @TODO: Instead of having this complex exports finder, use scopes and relatedModules upon resolving
  private getRelatedModuleExports(parentModule: Module): Token[] {
    let providers: Token[] = [];

    const findModule = (target: Type<any>) => {
      return Utils.getValues<string, Module>(
        this.container.getModules().entries(),
      ).find(module => module.target === target);
    };

    const find = (module: Module) => {
      const exports = [...module.exports.values()];
      const modules = [...module.relatedModules.values()];

      console.log(exports);

      modules.forEach(module => {
        const index = exports.indexOf(module.target);

        if (index !== 1) {
          const moduleRef = findModule(<Type<any>>exports[index]);
          exports.splice(index, 1);
          return this.getRelatedModuleExports(moduleRef!);
        }

        providers = [...providers, ...exports];
      });
    };

    for (const module of parentModule.relatedModules.values()) {
      find(module);
    }

    return providers;
  }

  private linkRelatedProviders() {
    const providers = this.getRelatedModuleExports(this);

    console.log(providers);

    providers.forEach(provider => {
      const ref = this.container.getProvider(provider);

      return this.providers
        .bind(provider)
        .toConstantValue(ref)
        .whenInjectedInto(<any>provider);
    });
  }

  private async bindProviders() {
    const providers = [...this.providerContainer.values()];

    this.linkRelatedProviders();

    await Promise.all(
      providers.map(async provider => {
        const type = this.getProviderType(provider);
        await this.bind(type, provider);
      }),
    );
  }

  public async create() {
    if (this.providers.isBound(this.target)) return;

    this.providers.bind(this.target).toSelf();
    const module = this.providers.get<Type<Module>>(this.target);

    await this.bindProviders();

    (<OnModuleInit>module).onModuleInit &&
      (await (<OnModuleInit>module).onModuleInit());

    await Promise.all(
      this.container.getAllProviders(MODULE_INITIALIZER, this.target),
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

  private bindClassProvider(provider: ClassProvider) {
    return this.providers.bind(provider.provide).to(provider.useClass);
  }

  private bindValueProvider(provider: ValueProvider<any>) {
    return this.providers
      .bind(provider.provide)
      .toConstantValue(provider.useValue);
  }

  private async getDependencyFromTree(dependency: Token | ForwardRef) {
    let provider!: Type<any>;

    const findDependency = async (module: Module) => {
      if (provider) return;

      if (module.providers.isBound(<Token>dependency)) {
        provider = module.providers.get(<Token>dependency);
        return;
      }

      await Promise.all(
        [...module.relatedModules.values()].map(module =>
          findDependency(module),
        ),
      );
    };

    await findDependency(this);

    return provider;
  }

  private async bindFactoryProvider(provider: FactoryProvider<Type<any>>) {
    // Shouldn't resolve dependencies before the actual binding happens
    const deps = await Promise.all(
      provider.deps.map(dep => this.getDependencyFromTree(dep)),
    );
    // const factory = await provider.useFactory(...deps);
    if (provider.scope === SCOPES.TRANSIENT) {
      return this.providers
        .bind(provider.provide)
        .toDynamicValue(() => <any>provider.useFactory(...deps));
    }

    this.providers
      .bind(provider.provide)
      .toProvider(() => <any>provider.useFactory(...deps));
  }

  private resolveProviderScope(provider: Type<any>) {
    return Reflect.getMetadata(SCOPE, provider);
  }

  private async bind(type: string, provider: Provider) {
    // @TODO: Add useExisting binding
    if (type === PROVIDER_TYPES.DEFAULT) {
      const scope = this.resolveProviderScope(<Type<any>>provider);
      const lazyInjects = Registry.getLazyInjects(<Type<any>>provider);
      lazyInjects.forEach(({ lazyInject, forwardRef }) => {
        const token = Registry.getForwardRef(forwardRef);
        lazyInject(this.lazyInject, <any>token);
      });
      this.bindProvider(scope, <Type<any>>provider);
    } else if (type === PROVIDER_TYPES.FACTORY) {
      await this.bindFactoryProvider(<FactoryProvider<any>>provider);
    } else if (type === PROVIDER_TYPES.VALUE) {
      this.bindValueProvider(<ValueProvider<any>>provider);
    } else if (type === PROVIDER_TYPES.CLASS) {
      this.bindClassProvider(<ClassProvider>provider);
    }
  }

  public addGlobalProviders() {
    this.providers.bind(Injector).toConstantValue(this.providers);
    this.providers.bind(ModuleContainer).toConstantValue(this.container);

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
