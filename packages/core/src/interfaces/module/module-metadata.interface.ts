import { DynamicModule } from './dynamic-module.interface';
import { ForwardRef } from '../forward-ref.interface';
import { Provider } from '../provider.interface';

export type ModuleImport =
  | Provider
  | DynamicModule
  | ForwardRef
  | Promise<DynamicModule>;
export type ModuleExport = Provider | DynamicModule;

export interface ModuleMetadata {
  imports?: ModuleImport[];
  exports?: ModuleExport[];
  providers?: Provider[];
}
