import { Type } from '@nest/core';

import { MetadataStorage } from '../metadata-storage';

export abstract class ContextCreator {
  protected abstract createConcreteContext<T extends any[], R extends any[]>(
    metadata: T,
  ): R;
  protected getGlobalMetadata?<T extends any[], R extends any[]>(): T;

  protected createContext<T extends any[], R extends any[]>(
    controller: Type<any>,
    methodName: string,
    metadata: string,
  ): R {
    const globalMetadata = this.getGlobalMetadata && this.getGlobalMetadata<T>();
    const classMetadata = MetadataStorage.getMetadata<T>(controller, metadata);
    const methodMetadata = MetadataStorage.getMetadata<T>(controller, metadata, methodName);

    return [
      ...this.createConcreteContext<T, R>(globalMetadata) || ([] as T),
      ...this.createConcreteContext<T, R>(classMetadata),
      ...this.createConcreteContext<T, R>(methodMetadata),
    ] as R;
  }
}