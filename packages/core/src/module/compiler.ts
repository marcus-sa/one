import { ModuleTokenFactory } from './module-token-factory';
import { Registry } from '../registry';
import { Utils } from '../util';
import {
  ModuleImport,
  DynamicModule,
  Type,
  ModuleFactory,
} from '../interfaces';

export class ModuleCompiler {
  private readonly moduleTokenFactory = new ModuleTokenFactory();

  public async compile(
    module: Partial<ModuleImport>,
    scope: Type<any>[],
  ): Promise<ModuleFactory> {
    const { target, dynamicMetadata } = await this.extractMetadata(module);
    const token = this.moduleTokenFactory.create(
      target,
      scope,
      dynamicMetadata,
    );
    return { target, dynamicMetadata, token };
  }

  public async extractMetadata(
    module: Partial<ModuleImport>,
  ): Promise<ModuleFactory> {
    const moduleRef = await Utils.getDeferred<Type<any> | DynamicModule>(
      module,
    );

    if (!Registry.isDynamicModule(moduleRef)) {
      return { target: <Type<any>>module };
    }

    const { module: target, ...dynamicMetadata } = <DynamicModule>moduleRef;
    return { target, dynamicMetadata };
  }
}
