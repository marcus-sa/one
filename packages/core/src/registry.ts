import { InvalidProviderException } from './errors';
import { InjectionToken } from './module';
import { Reflector } from './reflector';
import { Utils } from './util';
import {
  ProvideToken,
  ILazyInject,
  ForwardRef,
  Provider,
  Type,
  FactoryProvider,
  ValueProvider,
  ClassProvider,
  ExistingProvider,
  DynamicModule,
  ModuleImport,
  Token,
} from './interfaces';

export class Registry {
  public static readonly lazyInjects = new Set<ILazyInject>();

  public static getLazyInjects(target: Type<Provider>): ILazyInject[] {
    return [...this.lazyInjects.values()].filter(
      provider => provider.target === target,
    );
  }

  public static hasForwardRef(provider: any) {
    return provider && (<ForwardRef>provider).forwardRef;
  }

  public static getForwardRef(provider: ModuleImport) {
    return Registry.hasForwardRef(provider)
      ? (<ForwardRef>provider).forwardRef()
      : provider;
  }

  public static getProviderName(provider: Provider) {
    return this.hasProvideToken(provider)
      ? (<ProvideToken>provider).provide.get().toString()
      : (<Type<Provider>>provider).name;
  }

  public static getInjectionToken(provider: any): Token {
    return provider instanceof InjectionToken
      ? (<InjectionToken<any>>provider).get()
      : <Type<any>>provider;
  }

  public static assertProvider(val: any): Type<any> | InjectionToken<any> {
    if (/*!Reflector.isProvider(val) && */!(val && !Utils.isNil(val.name) && (Utils.isFunction(val) || Utils.isFunction(val.constructor)))) {
      throw new InvalidProviderException(val);
    }

    return val;
  }

  public static getProviderToken(provider: Provider): Token {
    return this.getInjectionToken((<ProvideToken>provider).provide || provider);
  }

  public static isDynamicModule(module: any): module is DynamicModule {
    return !!(<DynamicModule>module).module;
  }

  public static isFactoryProvider<T = any>(
    provider: Provider,
  ): provider is FactoryProvider<T> {
    return !!(<FactoryProvider<T>>provider).useFactory;
  }

  public static isValueProvider<T = any>(
    provider: Provider,
  ): provider is ValueProvider<T> {
    return !!(<ValueProvider<T>>provider).useValue;
  }

  public static isClassProvider(provider: Provider): provider is ClassProvider {
    return !!(<ClassProvider>provider).useClass;
  }

  public static isExistingProvider(
    provider: Provider,
  ): provider is ExistingProvider {
    return !!(<ExistingProvider>provider).useExisting;
  }

  public static hasProvideToken(provider: Provider): provider is ProvideToken {
    return !!(<ProvideToken>provider).provide;
  }
}
