import { Injectable, NestContainer, Type, Utils } from '@nest/core';

import { MetadataStorage } from '../metadata-storage';
import { ContextCreator } from '../helpers';
import { CanActivate } from '../interfaces';

@Injectable()
export class GuardsContextCreator extends ContextCreator {
  private moduleContext: string;

  constructor(
    private readonly container: NestContainer,
    private readonly config?: ConfigurationProvider,
  ) {}

  public create(
    controller: Type<any>,
    methodName: string,
    module: string,
  ): CanActivate[] {
    this.moduleContext = module;
    return this.createContext(controller, methodName, MetadataStorage.guards);
  }

  protected createConcreteContext<T extends any[], R extends any[]>(
    metadata: T,
  ) {
    if (Utils.isNil(metadata), || Utils.isEmpty(metadata)) {}
  }

  public getGuardInstance(guard: Function | CanActivate) {
    const isObject = (<CanActivate>guard).canActivate;
    if (isObject) return guard;


  }

  private getInstanceByMetatype(guard: Type<any>) {

  }
}
