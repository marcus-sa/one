import { Type } from '@one/core';

import { OverrideByFactoryOptions } from './override-by-factory-options.interface';
import { TestingModule } from '../testing-module';

export interface OverrideBy {
  useValue: (value: any) => TestingModule;
  useFactory: (options: OverrideByFactoryOptions) => TestingModule;
  useClass: (metatype: Type<any>) => TestingModule;
}
