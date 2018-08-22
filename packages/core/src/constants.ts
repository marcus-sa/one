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

export interface Metadata {
  IMPORTS: 'imports';
  EXPORTS: 'exports';
  PROVIDERS: 'providers';
}

export const METADATA: Metadata = {
  IMPORT: 'imports',
  EXPORTS: 'exports',
  PROVIDERS: 'providers',
};

export interface Scopes {
  SINGLETON: 'singleton-scope';
  TRANSIENT: 'transient-scope';
  REQUEST: 'request-scope';
}

export const SCOPES: Scopes = {
  SINGLETON: 'singleton-scope',
  TRANSIENT: 'transient-scope',
  REQUEST: 'request-scope',
};

export interface ProviderTypes {
  FACTORY: 'use-factory';
  CLASS: 'use-class';
  EXISTING: 'use-existing';
  VALUE: 'use-value';
  DEFAULT: 'provider';
}

export const PROVIDER_TYPES: ProviderTypes = {
  FACTORY: 'use-factory',
  CLASS: 'use-class',
  EXISTING: 'use-existing',
  VALUE: 'use-value',
  DEFAULT: 'provider',
};

export const ModuleRefs = Symbol.for('MODULE_REFS');
export const Modules = Symbol.for('MODULE_REFS');
export const APP_INITIALIZER = Symbol.for('APP_INITIALIZER');
export const MODULE_INITIALIZER = Symbol.for('MODULE_INITIALIZER');
export const SCOPE = 'resolve-scope';
export class Injector extends Container {}
