import { Container } from 'inversify';

import { DynamicModule, ModuleImport, Provider, Type } from '../interfaces';
import { ModuleCompiler } from './compiler';
import { Registry } from '../registry';
import { Module } from './module';
import { Utils } from '../util';

export class ModuleContainer {
  private readonly moduleCompiler = new ModuleCompiler();
  private readonly modules = new Set<string>();
  private readonly moduleRefs = new Container({
    autoBindInjectable: true,
    defaultScope: 'Singleton',
  });
  private readonly dynamicModulesMetadata = new Map<
    string,
    Partial<DynamicModule>
  >();

  public getModuleRef(token: string) {
    if (!this.modules.has(token)) {
      throw new Error('getModuleRef');
    }

    return this.modulesRefs.get<Module>(token);
  }

  public getModules() {
    return this.modules;
  }

  public async addProvider(provider: Provider, token: string) {
    if (!this.modules.has(token)) throw new Error('addProvider');

    const module = this.modulesRefs.get<Module>(token);
    await module.addProvider(provider);
  }

  public addExportedProvider(component: Type<any>, token: string) {
    if (!this.modules.has(token)) throw new Error('UnknownModuleException');

    const module = this.moduleRefs.get<Module>(token);
    module.addExportedProvider(component);
  }

  public async addModule(module: ModuleImport, scope: Type<any>[]) {
    if (!module) throw new Error('Container#addModule');

    const {
      target,
      dynamicMetadata,
      token,
    } = await this.moduleCompiler.compile(module, scope);
    if (this.modules.has(token)) return;

    const moduleRef = new Module(target, scope, this);
    this.moduleRefs.bind(token).to(moduleRef);
    this.modules.add(token);

    this.addDynamicMetadata(token, dynamicMetadata, target);
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

  private addDynamicModules(modules: ModuleImport[] = []) {
    modules.forEach(module => this.addModule(module, scope));
  }

  public async addRelatedModule(
    relatedModule: Type<any> | DynamicModule,
    token: string,
  ) {
    if (!this.modules.has(token)) return;

    const module = this.moduleRefs.get<Module>(token);
    const scope = [...module.scope, module.target];

    const { token: relatedModuleToken } = await this.moduleCompiler.compile(
      relatedModule,
      scope,
    );

    const related = this.moduleRefs.get<Module>(relatedModuleToken);
    module.addRelatedModule(related);
  }

  public getDynamicMetadataByToken(token: string, key: keyof DynamicModule) {
    const metadata = this.dynamicModulesMetadata.get(token);
    return metadata && metadata[key] ? metadata[key] : [];
  }
}
