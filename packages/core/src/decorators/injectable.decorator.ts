import { injectable } from 'inversify';
import 'reflect-metadata';

import { INJECTABLE_METADATA } from '../constants';

export function Injectable(): ClassDecorator {
  return (target: object) => {
    Reflect.defineMetadata(INJECTABLE_METADATA, true, target);

    injectable()(target);
  };
}
