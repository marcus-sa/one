import { Container } from 'inversify';

import {
  ClassProvider,
  DynamicModule,
  FactoryProvider,
  Provider,
  Type,
  ValueProvider,
} from '../interfaces';
import {
  Injector,
  MODULE_INITIALIZER,
  PROVIDER_TYPES,
  SCOPES,
} from '../constants';
import { ModuleContainer } from './container';
import { Registry } from '../registry';

export class Module {
  private readonly relatedModules = new Set<Module>();
  public readonly providers = new Container();
  public readonly exports = new Set<string>();

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

  public addExportedProvider(provider: Partial<Provider | DynamicModule>) {
    const addExportedUnit = (token: string) =>
      this.exports.add(this.validateExportedProvider(token));
  }

  public async create() {
    this.addGlobalProviders();

    await Promise.all(this.providers.getAll(<any>MODULE_INITIALIZER));
  }

  /*private resolveProviderScope(provider: Type<any>) {
    return Reflect.getMetadata(SCOPE, provider);
  }*/

  private getProviderType(provider: Partial<Provider>) {
    if (provider.useFactory) {
      return PROVIDER_TYPES.FACTORY;
    } else if (provider.useValue) {
      return PROVIDER_TYPES.VALUE;
    } else if (provider.useClass) {
      return PROVIDER_TYPES.CLASS;
    } else if (provider.useExisting) {
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
    return this.module.bind(provider.provide).to(provider.useClass);
  }

  private bindValueProvider(provider: ValueProvider) {
    return this.providers
      .bind(provider.provide)
      .toConstantValue(provider.useValue);
  }

  private async bindFactoryProvider(provider: FactoryProvider) {
    // Shouldn't resolve dependencies before the actual binding happens
    const deps = await this.getDependencies(provider.deps);
    const factory = await provider.useFactory(...deps);
    // const factory = await provider.useFactory(...deps);
    /*if (provider.scope === SCOPES.TRANSIENT) {
      return this.module.providers
        .bind(provider.provide)
        .toDynamicValue(() => provider.useFactory(...deps));
    }*/

    this.providers.bind(provider.provide).toConstantValue(factory);
  }

  private async bind(type: string, provider: Partial<Provider>) {
    // @TODO: Add useExisting binding
    if (type === PROVIDER_TYPES.DEFAULT) {
      const scope = this.resolveProviderScope(provider);
      const lazyInjects = Registry.getLazyInjects(provider);
      lazyInjects.forEach(({ lazyInject, forwardRef }) => {
        const token = Registry.getForwardRef(forwardRef);
        lazyInject(this.module.lazyInject, <any>token);
      });
      this.bindProvider(scope, provider);
    } else if (type === PROVIDER_TYPES.FACTORY) {
      await this.bindFactoryProvider(provider);
    } else if (type === PROVIDER_TYPES.VALUE) {
      this.bindValueProvider(provider);
    } else if (type === PROVIDER_TYPES.CLASS) {
      this.bindClassProvider(provider);
    }
  }

  public addGlobalProviders() {
    this.providers.bind(Injector).toConstantValue(this.providers);
    this.providers
      .bind(Injector)
      .toConstantValue(this.providers)
      .whenInjectedInto(<any>this.target);
  }
}
