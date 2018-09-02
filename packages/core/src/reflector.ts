import 'reflect-metadata';

import { INJECTABLE_METADATA } from './constants';
import { Type } from './interfaces';

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

  public static get(target: Type<any>, metadataKey: string) {
    return Reflect.getMetadata(metadataKey, <any>target) || [];
  }

  public static isProvider(target: Type<any>) {
    return Reflect.hasMetadata(INJECTABLE_METADATA, <any>target);
  }
}
