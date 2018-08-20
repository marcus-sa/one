import { Container } from 'inversify';

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

export const ModuleRefs = Symbol.for('MODULE_REFS');
export const Modules = Symbol.for('MODULE_REFS');
export const APP_INITIALIZER = Symbol.for('APP_INITIALIZER');
export const MODULE_INITIALIZER = Symbol.for('MODULE_INITIALIZER');
export const SCOPE = 'resolve-scope';
export class Injector extends Container {}
