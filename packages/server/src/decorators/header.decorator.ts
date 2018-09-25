import { MetadataStorage } from '../metadata-storage';

export function Header(name: string, value: string): MethodDecorator {
  return (target, propertyKey) => {
    MetadataStorage.headers.add({
      propertyKey,
      target: target.constructor,
      value,
      name,
    });
  };
}