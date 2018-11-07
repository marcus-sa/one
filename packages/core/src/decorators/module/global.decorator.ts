import { SHARED_MODULE_METADATA } from '../../constants';

/** @deprecated */
export function Global(): ClassDecorator {
  return (target: object) => {
    Reflect.defineMetadata(SHARED_MODULE_METADATA, true, target);
  };
}
