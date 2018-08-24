// No enum support for ts-jest
import { Container } from 'inversify';

/**
 export enum METADATA {
  IMPORTS = 'imports',
  EXPORTS = 'exports',
  PROVIDERS = 'providers',
}
 export enum SCOPES {
  SINGLETON = 'singleton-scope',
  TRANSIENT = 'transient-scope',
  REQUEST = 'request-scope',
}

 export enum PROVIDER_TYPES {
  FACTORY = 'use-factory',
  CLASS = 'use-class',
  EXISTING = 'use-existing',
  VALUE = 'use-value',
  DEFAULT = 'provider',
}
 */

export const APP_INITIALIZER = Symbol.for('APP_INITIALIZER');
export const MODULE_INITIALIZER = Symbol.for('MODULE_INITIALIZER');

export class Injector extends Container {}

export const METADATA = {
  IMPORTS: 'imports',
  EXPORTS: 'exports',
  PROVIDERS: 'providers',
};

export const SCOPE = 'resolve-scope';
export const SCOPES = {
  SINGLETON: 'singleton-scope',
  TRANSIENT: 'transient-scope',
  REQUEST: 'request-scope',
};

export const PROVIDER_TYPES = {
  FACTORY: 'use-factory',
  CLASS: 'use-class',
  EXISTING: 'use-existing',
  VALUE: 'use-value',
  DEFAULT: 'provider',
};
