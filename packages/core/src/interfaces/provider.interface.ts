import { InjectionToken } from '../module';
import { Type } from './type.interface';
import { Dependency } from './module';

export type Provider =
  | ProvideToken
  | ValueProvider
  | FactoryProvider
  | ExistingProvider
  | ClassProvider
  | Dependency;

export interface ClassProvider extends ProvideToken {
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
  useExisting: Dependency;
}

export interface ValueProvider<T> extends ProvideToken {
  useValue: T;
}

export interface FactoryProvider<T> extends ProvideToken, MultiDepsProvider {
  useFactory: (...args: any[]) => T | Promise<T>;
  scope?: string;
}
