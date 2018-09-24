import { TargetPropertyRef } from '@nest/core';

export interface RequestMappingMetadata extends TargetPropertyRef {
  method: string;
  path: string;
}