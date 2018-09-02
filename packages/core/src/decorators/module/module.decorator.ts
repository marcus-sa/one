import { injectable } from 'inversify';

import { ModuleMetadata } from '../../interfaces';
import { Reflector } from '../../reflector';
import { MODULE_METADATA } from '../../constants';

export function Module(metadata: ModuleMetadata = {}): ClassDecorator {
  return (target: object) => {
    Reflector.defineByKeys(target, metadata);
    Reflect.defineMetadata(MODULE_METADATA, true, target);

    return injectable()(target);
  };
}
