import { Type } from './type.interface';
import { SCOPES } from '../constants';

export type Provider = ValueProvider | FactoryProvider | ExistingProvider | ClassProvider | Type<any>;

export interface ClassProvider {
	provide?: symbol;
	useClass: Type<any>;
}

export interface ProvideToken {
	provide: symbol;
}

export interface MultiDepsProvider {
	deps?: any[];
	multi?: boolean;
}

export interface ExistingProvider {
	useExisting: Type<any> | symbol;
}

export interface ValueProvider extends ProvideToken {
	useValue: any;
}

export interface FactoryProvider extends ProvideToken, MultiDepsProvider {
	useFactory: (...args: any[]) => any | Promise<any>;
	scope?: SCOPES;
}
