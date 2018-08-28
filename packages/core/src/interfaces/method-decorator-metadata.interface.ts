import { TargetRef } from '@one/core';

export interface MethodDecoratorMetadata extends TargetRef {
  method: string;
  [key: string]: any;
}
