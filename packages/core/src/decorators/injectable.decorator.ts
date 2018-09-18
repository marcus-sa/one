import 'reflect-metadata';
import { injectable } from 'inversify';

import { INJECTABLE_METADATA } from '../constants';

export function Injectable(): ClassDecorator {
  return (target: object) => {
    Reflect.defineMetadata(INJECTABLE_METADATA, true, target);

    injectable()(<any>target);
  };
}