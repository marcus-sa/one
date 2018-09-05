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
      ? (<ProvideToken>provider).provide.toString()
      : (<Type<Provider>>provider).name;
  }

  public static getProviderToken(provider: Provider): Token {
    return (<ProvideToken>provider).provide || <Type<Provider>>provider;
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

  public static isClassProvider(
    provider: Provider,
  ): provider is ClassProvider {
    return !!(<ClassProvider>provider).useClass;
  }

  public static isExistingProvider(
    provider: Provider,
  ): provider is ExistingProvider {
    return !!(<ExistingProvider>provider).useExisting;
  }

  public static hasProvideToken(
    provider: Provider,
  ): provider is ProvideToken {
    return !!(<ProvideToken>provider).provide;
  }
}
