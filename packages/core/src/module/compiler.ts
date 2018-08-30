import { ModuleImport, DynamicModule, Type } from '../interfaces';
import { ModuleTokenFactory } from './module-token-factory';
import { Registry } from '../registry';

export interface ModuleCompilation {
  target: Type<any>;
  token?: string;
  dynamicMetadata?: Partial<DynamicModule>;
}

export class ModuleCompiler {
  private readonly moduleTokenFactory = new ModuleTokenFactory();

  public async compile(
    module: Type<any> | DynamicModule | Promise<DynamicModule>,
    scope: Type<any>[],
  ): Promise<ModuleCompilation> {
    const { target, dynamicMetadata } = await this.extractMetadata(module);
    const token = this.moduleTokenFactory.create(
      target,
      scope,
      dynamicMetadata,
    );
    return { target, dynamicMetadata, token };
  }

  public async extractMetadata(module): Promise<ModuleCompilation> {
    if (!Registry.isDynamicModule(module)) {
      return { target: module };
    }

    const { module: target, ...dynamicMetadata } = await module;
    return { target, dynamicMetadata };
  }
}
