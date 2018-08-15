import { ModuleWithProviders } from './module-with-providers.interface';
import { Provider } from '../provider.interface';
import { Type } from '../type.interface';

export type ExportMetadata = Provider | ModuleMetadata;

export interface ModuleMetadata {
	imports?: Array<ModuleWithProviders | Type<any>>;
	exports?: ExportMetadata[];
	providers?: Provider[];
}
