import 'reflect-metadata';
import { SCOPES, SCOPE } from '../../constants';

export function TransientScope(): ClassDecorator {
  return target => {
    Reflect.defineMetadata(SCOPE, SCOPES.TRANSIENT, target);
  };
}
