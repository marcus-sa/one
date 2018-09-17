import { Type } from './type.interface';
import { ForwardRef } from './forward-ref.interface';
import { Token } from './token.interface';
import { Dependency } from './module';
import { Injectable } from './injectable.interface';
import { InjectionToken } from '../module';

export type Provider =
  | ProvideToken
  | ValueProvider
  | FactoryProvider
  | ExistingProvider
  | ClassProvider
  | Dependency;

export interface ClassProvider {
  provide: symbol;
  useClass: Type<Provider>;
}

export interface ProvideToken {
  provide: InjectionToken<any>;
}

export interface DepsProvider {
  deps: Dependency[];
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
