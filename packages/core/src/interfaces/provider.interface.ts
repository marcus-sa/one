import { Type } from './type.interface';
import { ForwardRef } from './forward-ref.interface';
import { Token } from './token.interface';

export type Provider =
  | ProvideToken
  | ValueProvider
  | FactoryProvider
  | ExistingProvider
  | ClassProvider
  | ForwardRef
  | Token;

export interface ClassProvider {
  provide: symbol;
  useClass: Type<any>;
}

export interface ProvideToken {
  provide: symbol;
}

export interface DepsProvider {
  deps: Array<Token | ForwardRef>;
}

export interface MultiDepsProvider extends DepsProvider {
  multi?: boolean;
}

export interface ExistingProvider {
  useExisting: Token;
}

export interface ValueProvider<T> extends ProvideToken {
  useValue: T;
}

export interface FactoryProvider<T> extends ProvideToken, MultiDepsProvider {
  useFactory: (...args: any[]) => T | Promise<T>;
  scope?: string;
}
