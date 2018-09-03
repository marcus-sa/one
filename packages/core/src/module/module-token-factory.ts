import { Type, DynamicModule } from '../interfaces';
import * as hash from 'object-hash';
import { Module } from './module';

export class ModuleTokenFactory {
  public create(
    target: Type<Module>,
    scope: Type<Module>[],
    dynamicModuleMetadata?: Partial<DynamicModule>,
  ): string {
    return hash({
      module: this.getModuleName(target),
      dynamic: this.getDynamicMetadataToken(dynamicModuleMetadata!),
      scope: this.getScopeStack(scope),
    });
  }

  private getDynamicMetadataToken(
    dynamicModuleMetadata: Partial<DynamicModule>,
  ) {
    return dynamicModuleMetadata ? JSON.stringify(dynamicModuleMetadata) : '';
  }

  private getModuleName(target: Type<Module>) {
    return target.name;
  }

  private getScopeStack(scope: Type<Module>[]) {
    return scope.reverse().map(this.getModuleName);
  }
}
