import * as hash from 'object-hash';

import { SHARED_MODULE_METADATA } from '../constants';
import { Type, DynamicModule } from '../interfaces';
import { OneModule } from './module';

export class ModuleTokenFactory {
  public create(
    target: Type<OneModule>,
    scope: Type<OneModule>[],
    dynamicModuleMetadata?: Partial<DynamicModule>,
  ): string {
    const reflectedScope = this.reflectScope(target);
    const isSingleScoped = reflectedScope === true;

    const opaqueToken = {
      module: this.getModuleName(target),
      dynamic: this.getDynamicMetadataToken(dynamicModuleMetadata!),
      scope: isSingleScoped ? this.getScopeStack(scope) : reflectedScope,
    };

    return hash(opaqueToken);
  }

  private getDynamicMetadataToken(
    dynamicModuleMetadata: Partial<DynamicModule>,
  ) {
    return dynamicModuleMetadata ? JSON.stringify(dynamicModuleMetadata) : '';
  }

  private getModuleName(target: Type<OneModule>) {
    return target.name;
  }

  public getScopeStack(scope: Type<OneModule>[]): string[] {
    const reversedScope = scope.reverse();
    const firstGlobalIndex = reversedScope.findIndex(
      s => this.reflectScope(s) === 'global',
    );
    scope.reverse();

    const stack =
      firstGlobalIndex >= 0
        ? scope.slice(scope.length - firstGlobalIndex - 1)
        : scope;
    return stack.map(module => module.name);
  }

  private reflectScope(target: Type<OneModule>) {
    const scope = Reflect.getMetadata(SHARED_MODULE_METADATA, target);
    return scope ? scope : 'global';
  }
}
