import 'reflect-metadata';

import { Type, Provider } from './interfaces';
import { NestModule } from './module';
import {
  SCOPE_METADATA,
  PROVIDER_METADATA,
  SHARED_MODULE_METADATA,
} from './constants';

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
    Reflect.defineMetadata(metadataKey, metadataValue, target, propertyKey!);
  }

  public static isGlobalModule(target: Type<NestModule>) {
    return Reflect.hasMetadata(SHARED_MODULE_METADATA, target);
  }

  public static isProvider(target: Type<Provider | NestModule>) {
    return Reflect.hasMetadata(PROVIDER_METADATA, target);
  }

  public static resolveProviderScope(provider: Type<Provider>) {
    return Reflect.getMetadata(SCOPE_METADATA, provider);
  }
}
