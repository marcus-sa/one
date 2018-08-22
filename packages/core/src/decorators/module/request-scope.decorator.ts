import 'reflect-metadata';
import { SCOPES, SCOPE } from '../../constants';

export function RequestScope(): ClassDecorator {
  return (target: object) => {
    Reflect.defineMetadata(SCOPE, SCOPES.REQUEST, target);
  };
}
