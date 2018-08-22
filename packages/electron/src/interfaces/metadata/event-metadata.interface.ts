import { Target } from '@nuclei/core';

export interface EventMetadata extends Target {
  method: string;
  name: string;
}
