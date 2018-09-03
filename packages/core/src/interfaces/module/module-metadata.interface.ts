import { DynamicModule } from './dynamic-module.interface';
import { ForwardRef } from '../forward-ref.interface';
import { Provider } from '../provider.interface';
import { Token } from '../token.interface';

export type ModuleExport = Provider | DynamicModule;
export type Dependency = Token | ForwardRef;
export type ModuleImport =
  | Provider
  | Promise<DynamicModule>
  | DynamicModule
  | Dependency;

export interface ModuleMetadata {
  imports?: ModuleImport[];
  exports?: ModuleExport[];
  providers?: Provider[];
}
