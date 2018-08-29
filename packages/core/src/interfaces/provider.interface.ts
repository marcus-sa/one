import { Type } from './type.interface';
import { ForwardRef } from './forward-ref.interface';

export type Provider =
  | ValueProvider
  | FactoryProvider
  | ExistingProvider
  | ClassProvider
  | Type<any>
  | ForwardRef
  | symbol;

export interface ClassProvider {
  provide?: symbol;
  useClass: Type<any>;
}

export interface ProvideToken {
  provide: symbol;
}

export interface DepsProvider {
  deps?: Array<Type<any> | symbol | ForwardRef>;
}

export interface MultiDepsProvider extends DepsProvider {
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
  scope?: string;
}
