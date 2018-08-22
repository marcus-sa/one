import { MetadataStorage } from '../storage';

export function Event(name: string): MethodDecorator {
  return (target: object, method: string) => {
    MetadataStorage.events.add({
      target: target.constructor,
      method,
      name,
    });
  };
}
