import { InjectionToken } from './injection-token';
import { ModuleCompiler } from './compiler';
import { Reflector } from '../reflector';
import { Registry } from '../registry';
import { OneModule } from './module';
import { Utils } from '../util';
import {
  UnknownModuleException,
  InvalidModuleException,
  UnknownProviderException,
  MissingInjectionTokenException,
} from '../errors';
import {
  Dependency,
  DynamicModule,
  ModuleExport,
  ModuleImport,
  Provider,
  Token,
  Type,
} from '../interfaces';

export interface StrictSelect {
  strict?: boolean;
}

export class OneContainer {
  private readonly moduleCompiler = new ModuleCompiler();
  private readonly globalModules = new Set<OneModule>();
  private readonly modules = new Map<string, OneModule>();
  public readonly moduleOrder = new Set<OneModule>();
  public readonly providerTokens: Token[] = [];
  private readonly dynamicModulesMetadata = new Map<
    string,
    Partial<DynamicModule>
  >();

  private getModulesFrom(module?: Type<OneModule>) {
    return !Utils.isNil(module)
      ? [this.getModule(module)]
      : this.getModuleValues();
  }

  public isProviderBound(
    provider: Type<any> | InjectionToken<any>,
    module?: Type<OneModule>,
  ) {
    const token = Registry.getProviderToken(provider);
    return this.getModulesFrom(module).some(({ providers }) =>
      providers.isBound(token),
    );
  }

  public replace(
    toReplace: Dependency,
    options: any & { scope: any[] | null },
  ) {
    [...this.modules.values()].forEach(module => {
      module.replace(toReplace, options);
    });
  }

  public getProvider<T>(
    provider: Type<T> | InjectionToken<T>,
    scope?: Type<OneModule>,
    { strict }: StrictSelect = {},
  ): T {
    const token = Registry.getProviderToken(provider);

    if (strict) {
      const module = this.getModule(scope!);
      if (module!.providers.isBound(token)) {
        return module!.providers.get(token);
      }
    } else {
      for (const { providers } of this.modules.values()) {
        if (providers.isBound(token)) {
          return providers.get<T>(token);
        }
      }
    }

    throw new UnknownProviderException(<any>provider, scope!);
  }

  public getAllProviders<T>(
    provider: InjectionToken<T>,
    target?: Type<OneModule>,
  ) {
    if (!Registry.isInjectionToken(provider)) {
      throw new MissingInjectionTokenException('Container.getAllProviders()');
    }

    const token = Registry.getProviderToken(provider);

    return Utils.flatten<T | Promise<Type<Provider>>>(
      this.getModulesFrom(target).map(
        ({ providers }) =>
          providers.isBound(token) ? providers.getAll(token) : [],
      ),
    );
  }

  public getModuleValues() {
    return Utils.getValues<OneModule>(this.modules.entries());
  }

  public hasModule(module: Type<any>) {
    return this.getModuleValues().some(({ target }) => target === module);
  }

  public getModule(module: Type<any>): OneModule | undefined {
    return this.getModuleValues().find(({ target }) => target === module);
  }

  public getModuleByToken(token: string) {
    if (!this.modules.has(token)) {
      throw new UnknownModuleException([]);
    }

    return <OneModule>this.modules.get(token);
  }

  public getReversedModules() {
    return [...this.modules.entries()].reverse();
  }

  public getModules() {
    return this.modules;
  }

  public async addProvider(provider: Provider, token: string) {
    const module = this.getModuleByToken(token);
    await module.addProvider(provider);
  }

  public addExported(component: ModuleExport, token: string) {
    const module = this.getModuleByToken(token);
    module.addExported(component);
  }

  public addGlobalModule(module: OneModule) {
    this.globalModules.add(module);
  }

  public async addModule(
    module: Partial<ModuleImport>,
    scope: Type<OneModule>[] = [],
  ) {
    if (!module) throw new InvalidModuleException(scope);

    const {
      target,
      dynamicMetadata,
      token,
    } = await this.moduleCompiler.compile(module, scope);
    if (this.modules.has(token)) return;

    const oneModule = new OneModule(target, scope, this);
    oneModule.addGlobalProviders();
    this.modules.set(token, oneModule);

    const modules = Utils.concat(scope, target);
    this.addDynamicMetadata(token, dynamicMetadata!, modules);
    Reflector.isGlobalModule(target) && this.addGlobalModule(oneModule);
  }

  private addDynamicMetadata(
    token: string,
    dynamicModuleMetadata: Partial<DynamicModule>,
    scope: Type<OneModule>[],
  ) {
    if (!dynamicModuleMetadata) return;

    this.dynamicModulesMetadata.set(token, dynamicModuleMetadata);
    this.addDynamicModules(dynamicModuleMetadata.imports, scope);
  }

  private addDynamicModules(
    modules: ModuleImport[] = [],
    scope: Type<OneModule>[],
  ) {
    modules.forEach(module => this.addModule(module, scope));
  }

  public bindGlobalScope() {
    this.modules.forEach(module => this.bindGlobalsToImports(module));
  }

  private bindGlobalsToImports(module: OneModule) {
    this.globalModules.forEach(globalModule =>
      this.bindGlobalModuleToModule(module, globalModule),
    );
  }

  private bindGlobalModuleToModule(
    module: OneModule,
    globalModule: OneModule,
  ) {
    if (module === globalModule) return;
    module.addImport(globalModule);
  }

  public async addImport(relatedModule: ModuleImport, token: string) {
    if (!this.modules.has(token)) return;

    const module = this.getModuleByToken(token);
    const scope = Utils.concat(module.scope, module.target);

    const { token: relatedModuleToken } = await this.moduleCompiler.compile(
      relatedModule,
      scope,
    );

    const related = this.getModuleByToken(relatedModuleToken);
    module.addImport(related);
  }

  public getDynamicMetadataByToken(token: string, key: keyof DynamicModule) {
    const metadata = this.dynamicModulesMetadata.get(token);
    return metadata && metadata[key] ? metadata[key] : [];
  }
}
