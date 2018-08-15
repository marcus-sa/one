import { DynamicModule } from './dynamic-module.interface';
import { Provider } from '../provider.interface';
import { Type } from '../type.interface';

export type ModuleImport = Type<any> | DynamicModule | symbol;
export type ModuleExport = DynamicModule | symbol | Provider;

export interface ModuleMetadata {
	imports?: Array<ModuleImport | Promise<DynamicModule>>;
	exports?: Array<ModuleExport | Promise<DynamicModule>>;
	providers?: Provider[];
}
