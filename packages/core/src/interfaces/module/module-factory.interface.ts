import { DynamicModule } from './dynamic-module.interface';
export { Type } from '../type.interface';

export interface ModuleFactory {
  target: Type<any>;
  token?: string;
  dynamicMetadata?: Partial<DynamicModule>;
}
