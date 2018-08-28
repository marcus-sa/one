import { MethodDecoratorMetadata } from '@one/core';

export interface EventMetadata extends MethodDecoratorMetadata {
  name: string;
}
