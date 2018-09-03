import 'reflect-metadata';

import { INJECTABLE_METADATA } from './constants';
import { Type, Injectable } from './interfaces';
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
    target: Type<Injectable | Module>,
    metadataKey: string | symbol,
  ) {
    return Reflect.getMetadata(metadataKey, <Injectable>target) || [];
  }

  public static isProvider(target: Type<Injectable | Module>) {
    return Reflect.hasMetadata(INJECTABLE_METADATA, <Injectable>target);
  }
}
