import 'reflect-metadata';

import { Type, Provider } from './interfaces';
import { OneModule } from './module';
import {
  SCOPE_METADATA,
  PROVIDER_METADATA,
  SHARED_MODULE_METADATA,
} from './constants';

export class Reflector {
  public static defineByKeys<T = object>(
    metadata: any,
    target: T,
    exclude: string[] = [],
  ): T {
    Object.keys(metadata)
      .filter(p => !exclude.includes(p))
      .forEach(property => {
        Reflect.defineMetadata(property, metadata[property], target);
      });

    return target;
  }

  public static get(metadataKey: string | symbol, target: any) {
    return Reflect.getMetadata(metadataKey, target) || [];
  }

  public static set(
    metadataKey: string | symbol,
    metadataValue: any,
    target: any,
    propertyKey?: string | symbol,
  ) {
    Reflect.defineMetadata(metadataKey, metadataValue, target, propertyKey!);
  }

  public static has(metadataKey: string | symbol, target: any) {
    return Reflect.hasMetadata(metadataKey, target);
  }

  public static isGlobalModule(target: Type<OneModule>) {
    return Reflect.hasMetadata(SHARED_MODULE_METADATA, target);
  }

  public static isProvider(target: Type<Provider | OneModule>) {
    return Reflect.hasMetadata(PROVIDER_METADATA, target);
  }

  public static resolveProviderScope(provider: Type<Provider>) {
    return Reflect.getMetadata(SCOPE_METADATA, provider);
  }
}
