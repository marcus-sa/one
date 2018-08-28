import { TargetRef, Type } from './interfaces';

export class BaseMetadataStorage {
  private static findByTarget<T extends TargetRef>(
    metadata: Set<T>,
    target: Type<any> | Function,
  ): T {
    return [...metadata.values()].find(value => value.target === target);
  }

  private static filterByTarget<T extends TargetRef>(
    metadata: Set<T>,
    target: Type<any> | Function,
  ): T[] {
    return [...metadata.values()].filter(value => value.target === target);
  }
}
