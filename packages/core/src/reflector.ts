import 'reflect-metadata';

import {
  SCOPE_METADATA,
  PROVIDER_METADATA,
  SHARED_MODULE_METADATA,
} from './constants';
import { Type, Provider } from './interfaces';
import { Module } from './module';

export class Reflector {
  public static defineByKeys<T = object>(
    target: T,
    metadata: { [name: string]: any },
    exclude: string[] = [],
  ): T {
    Object.keys(metadata)
      .filter(p => !exclude.includes(p))
      .forEach(property => {
        Reflect.defineMetadata(property, metadata[property], target);
      });

    return target;
  }

  public static get(
    target: Type<any>,
    metadataKey: string | symbol,
  ) {
    return Reflect.getMetadata(metadataKey, target) || [];
  }

  public static set(
    target: Type<any>,
    metadataKey: string | symbol,
    metadataValue: any,
    propertyKey?: string | symbol
  ) {
    Reflect.defineMetadata(metadataKey, metadataValue, target, propertyKey);
  }

  public static isGlobalModule(target: Type<Module>) {
    return !!Reflect.getMetadata(SHARED_MODULE_METADATA, target);
  }

  public static isProvider(target: Type<Provider | Module>) {
    return !!Reflect.getMetadata(PROVIDER_METADATA, target);
  }

  public static resolveProviderScope(provider: Type<Provider>) {
    return Reflect.getMetadata(SCOPE_METADATA, provider);
  }
}
