import { Target } from '@one/core';

export interface EventMetadata extends Target {
  method: string;
  name: string;
}
