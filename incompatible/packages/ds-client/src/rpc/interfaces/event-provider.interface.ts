import { MethodDecoratorMetadata } from '@one/core';

export interface EventProvider extends MethodDecoratorMetadata {
  event: string;
}
