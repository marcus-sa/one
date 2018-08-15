import { Provider } from './provider.interface';
import { Type } from './type.interface';

export type ExportMetadata = Provider | ModuleMetadata;

export interface ModuleMetadata {
	imports?: Type<any>/*ModuleMetadata*/[];
	exports?: ExportMetadata[];
	providers?: Provider[];
}
