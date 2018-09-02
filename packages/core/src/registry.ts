import { Module, ModuleCompiler, ModuleContainer } from './module';
import { MODULE_METADATA } from './constants';
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
} from './interfaces';

export class Registry {
  public static readonly lazyInjects = new Set<ILazyInject>();

  public static getLazyInjects(target: Type<any>): ILazyInject[] {
    return [...this.lazyInjects.values()].filter(
      provider => provider.target === target,
    );
  }

  public static async isModule(any: Type<any>) {
    const { target } = await ModuleCompiler.extractMetadata(any);
    return Reflect.hasMetadata(MODULE_METADATA, target);
  }

  public static hasForwardRef(provider: any) {
    return provider && (<ForwardRef>provider).forwardRef;
  }

  public static getForwardRef(provider: ModuleImport) {
    return Registry.hasForwardRef(provider)
      ? (<ForwardRef>provider).forwardRef()
      : provider;
  }

  public static getProviderName(provider: ProvideToken | Type<any>) {
    return this.isProvideToken(provider)
      ? (<ProvideToken>provider).provide.toString()
      : (<Type<any>>provider).name;
  }

  public static getProviderToken(provider: Provider): symbol | Type<any> {
    return (<ProvideToken>provider).provide || <Type<any>>provider;
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

  public static isProvideToken(provider: Provider): provider is ProvideToken {
    return !!(<ProvideToken>provider).provide;
  }

  /*public getAllProviders(provider: Type<any> | symbol) {
    const modules = [...this.container.getModules()];

    return Utils.flatten(
      modules.map(token => {
        const module = this.container.getModuleRef(token);

        return module.providers.isBound(provider)
          ? module.providers.get(provider)
          : [];
      }),
    );
  }*/

  /*public getModuleFromProviderRef(
    provider: Provider,
    modules: Module[] = this.getModules(),
  ) {
    const token = this.getProviderToken(provider);

    for (const module of modules) {
      if (module.providers.isBound(token)) {
        return module;
      }
    }
  }

  public getProvider(
    provider: Provider,
    modules: Module[] = this.getModules(),
  ) {
    const token = this.getProviderToken(provider);

    for (const { providers } of modules) {
      if (providers.isBound(token)) {
        return providers.get(token);
      }
    }
  }*/

  /*public async getDependencyFromTree(module: Module, dependency: Provider) {
    console.log(<any>dependency);
    const token = this.getProviderToken(dependency);
    const modules = new Set<string>();
    let provider!: Type<any>;

    const findDependency = async (module: Module) => {
      if (provider || !this.isModule(module) || modules.has(module.target.name))
        return;

      modules.add(module.target.name);

      if (module.providers.isBound(token)) {
        console.log('token', token);
        provider = this.isProviderBound(dependency)
          ? this.getProvider(dependency)
          : module.providers.get(token);
        return;
      }

      const imports = module.imports.map(async (moduleRef, i) => {
        if (!module.exports.includes(moduleRef)) return;
        const resolvedModule = this.getModule(
          await module.resolveModuleByIndex(moduleRef, i),
        );

        await findDependency(resolvedModule);
      });

      const exports = module.exports.map(async ref => {
        const exported = this.getModule(<Type<any>>ref);

        if (ref === dependency) {
          provider = this.getProvider(dependency);
          return;
        }

        await findDependency(exported);
      });

      await Promise.all([...imports, ...exports]);
    };

    await findDependency(module);

    console.log(module.target.name, dependency);
    if (!provider) {
      // @TODO: Log real modules tree
      throw new Error(
        `Couldn't find provider ${this.getProviderName(dependency)} in tree: ${[
          ...modules,
        ].join(' -> ')}`,
      );
    }

    return provider;
  }*/
}
