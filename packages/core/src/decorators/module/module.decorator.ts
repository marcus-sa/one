import { injectable } from 'inversify';

import { ModuleMetadata } from '../../interfaces';
import { Reflector } from '../../reflector';

export function Module(metadata: ModuleMetadata = {}): ClassDecorator {
  return (target: object) => {
    Reflector.defineMetadataByKeys(target, metadata);

    return injectable()(target);
  };
}
