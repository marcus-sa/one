import 'reflect-metadata';

import { Injector, PROVIDER_TYPES, ProviderTypes, SCOPE, Scopes, SCOPES } from '../constants';
import { Registry } from '../registry';
import { Module } from './module';
import {
  ClassProvider,
  ExistingProvider,
  FactoryProvider,
  MultiDepsProvider,
  Provider,
  ProvideToken,
  Type,
  ValueProvider,
} from '../interfaces';

export class ProviderFactory {
  constructor(
    private readonly providers: Provider[],
    private readonly registry: Registry,
    private readonly module: Module,
  ) {}

  private getDependencies(dependencies: Provider[] = []) {
    return Promise.all(
      dependencies.map(dependency => {
        const provider = Registry.getForwardRef(<any>dependency);

        return this.registry.getDependencyFromTree(this.module, <any>provider);
      }),
    );
  }

  private resolveProviderScope(provider: Type<any>): Scopes {
    return Reflect.getMetadata(SCOPE, provider);
  }

  private bindProvider(scope: Scopes, provider: Type<any>) {
    const binding = this.module.providers.bind(provider).toSelf();

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
    return this.module.providers.bind(provider.provide).to(provider.useClass);
  }

  private bindValueProvider(provider: ValueProvider) {
    return this.module.providers
      .bind(provider.provide)
      .toConstantValue(provider.useValue);
  }

  // @TODO: Add support for async bindings
  private async bindFactoryProvider(provider: FactoryProvider) {
    const deps = await this.getDependencies(provider.deps);

    if (provider.scope === SCOPES.TRANSIENT) {
      this.module.providers
        .bind(provider.provide)
        .toDynamicValue(() => provider.useFactory(...deps));
    }

    this.module.providers
      .bind(provider.provide)
      .toProvider(() => provider.useFactory(...deps));
  }

  private getProviderType(provider: Provider): ProviderTypes {
    if ((<FactoryProvider>provider).useFactory) {
      return PROVIDER_TYPES.FACTORY;
    } else if ((<ValueProvider>provider).useValue) {
      return PROVIDER_TYPES.VALUE;
    } else if ((<ClassProvider>provider).useClass) {
      return PROVIDER_TYPES.CLASS;
    } else if ((<ExistingProvider>provider).useExisting) {
      return PROVIDER_TYPES.EXISTING;
    }

    return PROVIDER_TYPES.DEFAULT;
  }

  private async resolveDependencies(provider: Provider) {
    const modules = await Promise.all(
      this.module.imports.map(async (module, i) => {
        const moduleRef = await this.module.resolveModule(module, i);
        return this.registry.modules.get(moduleRef);
      }),
    );

    modules.forEach(module => {
      const bind = (module: Module) => {
        module.exports.forEach(ref => {
          if (
            !this.registry.isModuleRef(ref) &&
            !this.module.providers.isBound(<any>ref)
          ) {
            const providerRef = this.module.getProvider(module.target, <any>(
              ref
            ));

            return this.module.providers
              .bind(<any>ref)
              .toConstantValue(providerRef)
              .whenInjectedInto(<any>this.registry.getProviderToken(provider));
          }

          if (this.registry.isModuleRef(<any>ref)) {
            bind(this.registry.getModule(<any>ref));
          }
        });
      };

      bind(module);
    });
  }

  private async bind(type: ProviderTypes, provider: Provider) {
    // @TODO: Add useExisting binding
    if (type === PROVIDER_TYPES.DEFAULT) {
      const scope = this.resolveProviderScope(<Type<any>>provider);
      const lazyInjects = Registry.getLazyInjects(<Type<any>>provider);
      lazyInjects.forEach(({ lazyInject, forwardRef }) => {
        const token = Registry.getForwardRef(forwardRef);
        lazyInject(this.module.lazyInject, <any>token);
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

  public async resolve() {
    await Promise.all(
      this.providers.map(async provider => {
        const isMulti = (<MultiDepsProvider>provider).multi;

        if (!isMulti && this.registry.isProviderBound(provider)) return;
        const type = this.getProviderType(provider);

        if (type !== PROVIDER_TYPES.DEFAULT && isMulti) {
          if (this.module.providers.isBound((<ProvideToken>provider).provide)) {
            throw new Error(
              `Provider: ${(<ProvideToken>(
                provider
              )).provide.toString()} is already bound. Flag as multi.`,
            );
          }
        }

        await this.bind(type, provider);
        await this.resolveDependencies(provider);
      }),
    );
  }
}
