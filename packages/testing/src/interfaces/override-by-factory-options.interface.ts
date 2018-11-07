import { Dependency } from '@one/core';

export interface OverrideByFactoryOptions {
  factory: (...args) => any;
  inject?: Dependency[];
}
