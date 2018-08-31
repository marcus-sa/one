import { Type, DynamicModule } from '../interfaces';
import * as hash from 'object-hash';

export class ModuleTokenFactory {
  public create(
    target: Type<any>,
    scope: Type<any>[],
    dynamicModuleMetadata?: Partial<DynamicModule>,
  ): string {
    return hash({
      module: target,
      dynamic: dynamicModuleMetadata || '', // this.getDynamicMetadataToken(dynamicModuleMetadata),
      scope: scope.reverse(),
    });
  }

  private getDynamicMetadataToken(
    dynamicModuleMetadata: Partial<DynamicModule>,
  ) {
    return dynamicModuleMetadata ? JSON.stringify(dynamicModuleMetadata) : '';
  }

  private getModuleName(target: Type<any>) {
    return target.name;
  }

  private getScopeStack(scope: Type<any>[]) {
    /*const reversedScope = scope.reverse();
    const firstGlobalIndex = reversedScope.findIndex(
      s => this.reflectScope(s) === 'global',
    );
    scope.reverse();

    const stack =
      firstGlobalIndex >= 0
        ? scope.slice(scope.length - firstGlobalIndex - 1)
        : scope;*/
    return scope.reverse().map(this.getModuleName);
  }

  /*private reflectScope(metatype: Type<any>) {
    const scope = Reflect.getMetadata(SHARED_MODULE_METADATA, metatype);
    return scope ? scope : 'global';
  }*/
}
