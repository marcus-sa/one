import { DynamicModule } from './dynamic-module.interface';
import { ForwardRef } from '../forward-ref.interface';
import { Provider } from '../provider.interface';
import { Type } from '../type.interface';

export type ModuleImport =
  | Type<any>
  | DynamicModule
  | Promise<DynamicModule | ForwardRef>;
export type ModuleExport = Provider | Type<any> | DynamicModule | symbol;

export interface ModuleMetadata {
  imports?: ModuleImport[];
  exports?: ModuleExport[];
  providers?: Provider[];
}
