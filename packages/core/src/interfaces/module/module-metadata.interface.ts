import { DynamicModule } from './dynamic-module.interface';
import { ForwardRef } from '../forward-ref.interface';
import { Provider } from '../provider.interface';
import { Token } from '../token.interface';

export type Dependency = Token | ForwardRef;

export type ModuleImport =
  | Token
  | DynamicModule
  | ForwardRef
  | Promise<DynamicModule>;
export type ModuleExport = Provider | DynamicModule;

export interface ModuleMetadata {
  imports?: ModuleImport[];
  exports?: ModuleExport[];
  providers?: Provider[];
}
