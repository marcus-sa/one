import { Container } from 'inversify';
import getDecorators from 'inversify-inject-decorators';

import { UnknownExportException } from '../errors';
import { ModuleContainer } from './container';
import { Registry } from '../registry';
import {
  ClassProvider,
  DynamicModule,
  FactoryProvider,
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

type Token = Type<any> | symbol;

export class Module {
  private readonly relatedModules = new Set<Module>();
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

  public async addProvider(provider: Provider) {
    const type = this.getProviderType(provider);

    await this.bind(type, provider);
  }

  private validateExported(token: Token, exported) {
    if (this.providers.isBound(token)) return token;

    const imported = [...this.relatedModules.values()];
    const importedRefNames = imported
      .filter(item => item)
      .map(({ target }) => target)
      .filter(target => target)
      .map(({ name }) => name);

    const name = Registry.getProviderName(token);
    if (!importedRefNames.includes(name)) {
      throw new UnknownExportException(this.target.name, exported.name);
    }

    return token;
  }

  public addExported(exported: Partial<Provider | DynamicModule>) {
    console.log('addExported', exported);

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

  public async create() {
    this.addGlobalProviders();

    const module = this.providers.resolve<Type<any>>(this.target);

    (<OnModuleInit>module).onModuleInit &&
      (await (<OnModuleInit>module).onModuleInit());

    await Promise.all(
      this.providers.isBound(MODULE_INITIALIZER)
        ? this.providers.getAll(<any>MODULE_INITIALIZER)
        : [],
    );
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

  private bindValueProvider(provider: ValueProvider) {
    return this.providers
      .bind(provider.provide)
      .toConstantValue(provider.useValue);
  }

  private async getDependencyFromTree(dependency: Type<any> | symbol) {
    let provider!: Type<any>;

    const findDependency = async (module: Module) => {
      if (provider) return;

      if (module.providers.isBound(dependency)) {
        provider = module.providers.get(dependency);
        return;
      }

      await Promise.all(
        [...module.relatedModules.values()].map(module =>
          findDependency(module),
        ),
      );
    };

    await findDependency(this);

    console.log(provider);

    return provider;
  }

  private async bindFactoryProvider(provider: FactoryProvider) {
    // Shouldn't resolve dependencies before the actual binding happens
    const deps = await Promise.all(
      provider.deps.map(dep => this.getDependencyFromTree(<any>dep)),
    );
    // const factory = await provider.useFactory(...deps);
    if (provider.scope === SCOPES.TRANSIENT) {
      return this.providers
        .bind(provider.provide)
        .toDynamicValue(() => provider.useFactory(...deps));
    }

    this.providers
      .bind(provider.provide)
      .toProvider(() => provider.useFactory(...deps));
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
      await this.bindFactoryProvider(<FactoryProvider>provider);
    } else if (type === PROVIDER_TYPES.VALUE) {
      this.bindValueProvider(<ValueProvider>provider);
    } else if (type === PROVIDER_TYPES.CLASS) {
      this.bindClassProvider(<ClassProvider>provider);
    }
  }

  public addGlobalProviders() {
    this.providers.bind(Injector).toConstantValue(this.providers);
    this.providers
      .bind(Injector)
      .toConstantValue(this.providers)
      .whenInjectedInto(this.target);
  }
}
