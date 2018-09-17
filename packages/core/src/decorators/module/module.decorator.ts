import { Injectable } from '../inversify.decorators';
import { ModuleMetadata } from '../../interfaces';
import { Reflector } from '../../reflector';

export function Module(metadata: ModuleMetadata = {}): ClassDecorator {
  return (target: object) => {
    Reflector.defineByKeys(target, metadata);

    return Injectable()(<any>target);
  };
}
