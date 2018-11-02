import { Type } from '@nest/core';

import { MiddlewareConfigure } from './middleware';

export interface ServerFeatureOptions {
  controllers: Type<any>[];
  prefix?: string;
  guards?: any[];
  interceptors?: any[];
  middleware?: any[];
  pipes?: any[];
  configure?: MiddlewareConfigure;
}
