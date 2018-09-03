import { TargetRef, Type, Provider } from './interfaces';

export class BaseMetadataStorage {
  protected static findByTarget<T extends TargetRef>(
    metadata: Set<T>,
    target: Type<Provider> | Function,
  ): T | undefined {
    return [...metadata.values()].find(value => value.target === target);
  }

  protected static filterByTarget<T extends TargetRef>(
    metadata: Set<T>,
    target: Type<Provider> | Function,
  ): T[] {
    return [...metadata.values()].filter(value => value.target === target);
  }
}
