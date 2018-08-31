import { DynamicModule, ModuleImport, Provider, Type } from '../interfaces';
import { UnknownModuleException, InvalidModuleException } from '../errors';
import { ModuleCompiler } from './compiler';
import { Module } from './module';

export class ModuleContainer {
  private readonly moduleCompiler = new ModuleCompiler();
  private readonly modules = new Map<string, Module>();
  private readonly dynamicModulesMetadata = new Map<
    string,
    Partial<DynamicModule>
  >();

  public getModuleRef(token: string) {
    if (!this.modules.has(token)) {
      throw new Error('getModuleRef');
    }

    return this.modules.get(token);
  }

  public getModules() {
    return this.modules;
  }

  public async addProvider(provider: Provider, token: string) {
    if (!this.modules.has(token)) throw new UnknownModuleException([provider]);

    const module = this.modules.get(token);
    await module.addProvider(provider);
  }

  public addExported(component: Type<any>, token: string) {
    if (!this.modules.has(token)) throw new UnknownModuleException([component]);

    const module = this.modules.get(token);
    module.addExported(component);
  }

  public async callModuleInitProviders() {}

  public async addModule(module: ModuleImport, scope: Type<any>[]) {
    if (!module) throw new InvalidModuleException(scope);

    const {
      target,
      dynamicMetadata,
      token,
    } = await this.moduleCompiler.compile(module, scope);
    if (this.modules.has(token)) return;

    const moduleRef = new Module(target, scope, this);
    this.modules.set(token, moduleRef);

    this.addDynamicMetadata(token, dynamicMetadata, [].concat(scope, target));

    await moduleRef.create();
  }

  private addDynamicMetadata(
    token: string,
    dynamicModuleMetadata: Partial<DynamicModule>,
    scope: Type<any>[],
  ) {
    if (!dynamicModuleMetadata) return;

    this.dynamicModulesMetadata.set(token, dynamicModuleMetadata);
    this.addDynamicModules(dynamicModuleMetadata.imports, scope);
  }

  private addDynamicModules(modules: ModuleImport[] = [], scope: Type<any>[]) {
    modules.forEach(module => this.addModule(module, scope));
  }

  public async addRelatedModule(
    relatedModule: Type<any> | DynamicModule,
    token: string,
  ) {
    if (!this.modules.has(token)) return;

    const module = this.modules.get(token);
    const scope = [].concat(module.scope, module.target);

    const { token: relatedModuleToken } = await this.moduleCompiler.compile(
      relatedModule,
      scope,
    );

    const related = this.modules.get(relatedModuleToken);
    module.addRelatedModule(related);
  }

  public getDynamicMetadataByToken(token: string, key: keyof DynamicModule) {
    const metadata = this.dynamicModulesMetadata.get(token);
    return metadata && metadata[key] ? metadata[key] : [];
  }
}
