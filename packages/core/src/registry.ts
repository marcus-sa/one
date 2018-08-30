import { Module } from './module/module';
import { Utils } from './util';
import { ModuleContainer } from './module/container';
import {
  DynamicModule,
  ProvideToken,
  ModuleImport,
  ILazyInject,
  ForwardRef,
  Provider,
  Type,
} from './interfaces/index';

export class Registry {
  public static readonly lazyInjects = new Set<ILazyInject>();

  constructor(private readonly container: ModuleContainer) {}

  public static getLazyInjects(target: Type<any>): ILazyInject[] {
    return [...this.lazyInjects.values()].filter(
      provider => provider.target === target,
    );
  }

  public static hasForwardRef(provider: any) {
    return provider && provider.hasOwnProperty('forwardRef');
  }

  public static getForwardRef(provider: Type<any> | symbol | ForwardRef) {
    return Registry.hasForwardRef(provider)
      ? (<ForwardRef>provider).forwardRef()
      : provider;
  }

  public static isDynamicModule(module: ModuleImport): module is DynamicModule {
    return !!(<DynamicModule>module).module;
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

  /*public getAllProviders(provider: Provider) {
    const token = this.getProviderToken(provider);

    return Utils.flatten(
      this.getModules().map(({ providers }) => {
        return providers.isBound(token) ? providers.getAll(token) : [];
      }),
    );
  }*/

  public getProviderName(provider: Provider) {
    return (<any>provider).hasOwnProperty('provide')
      ? (<ProvideToken>provider).provide.toString()
      : (<Type<any>>provider).name;
  }

  public getProviderToken(provider: Provider) {
    return (<ProvideToken>provider).provide || <Type<any>>provider;
  }
}
