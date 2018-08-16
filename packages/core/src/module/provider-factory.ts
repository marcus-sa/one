import 'reflect-metadata';

import { PROVIDER_TYPES, SCOPE, SCOPES } from '../constants';
import { Module } from './module';
import {
	ClassProvider,
	FactoryProvider,
	ValueProvider,
	Provider,
	Type, ExistingProvider, MultiDepsProvider,
} from '../interfaces';
import { ProvideToken } from "core/src/interfaces/provider.interface";

export class ProviderFactory {

	constructor(
		private readonly providers: Provider[],
		private readonly module: Module,
	) {}

	private getDependencies(dependencies: Provider[] = []) {
		// @TODO: Fix this, currently just a work around
		return dependencies.map(dependency =>
			// this.module.getProvider(dependency),
			this.module.registry.getProvider(<any>dependency)
		);
	}

	private resolveProviderScope(provider: Type<any>): SCOPES {
		return Reflect.getMetadata(SCOPE, provider);
	}

	private bindProvider(scope: SCOPES, provider: Type<any>) {
		const binding = this.module.providers.bind(provider).toSelf();

		switch (scope) {
			case SCOPES.TRANSIENT:
				return binding.inTransientScope();

			case SCOPES.REQUEST:
				return binding.inRequestScope();

			case SCOPES.SINGLETON:
			default:
				return binding.inSingletonScope();
		}
	}

	private bindClassProvider(provider: ClassProvider) {
		return this.module.providers.bind(provider.provide)
			.to(provider.useClass);
	}

	private bindValueProvider(provider: ValueProvider) {
		return this.module.providers.bind(provider.provide)
			.toConstantValue(provider.useValue);
	}

	private async bindFactoryProvider(provider: FactoryProvider) {
		const deps = () => this.getDependencies(provider.deps);

		if (provider.scope === SCOPES.TRANSIENT) {
			return this.module.providers.bind(provider.provide)
				.toDynamicValue(() => provider.useFactory(...deps()));
		}

		return this.module.providers.bind(provider.provide)
			.toFactory(() => provider.useFactory(...deps()));
	}

	private getProviderType(provider: Provider): PROVIDER_TYPES {
		if ((<FactoryProvider>provider).useFactory) {
			return PROVIDER_TYPES.FACTORY;
		} else if ((<ValueProvider>provider).useValue) {
			return PROVIDER_TYPES.VALUE;
		} else if ((<ClassProvider>provider).useClass) {
			return PROVIDER_TYPES.CLASS;
		} else if ((<ExistingProvider>provider).useExisting) {
			return PROVIDER_TYPES.EXISTING;
		}

		return PROVIDER_TYPES.DEFAULT;
	}

	private resolveDependencies(provider: any) {
		const modules = this.module.imports.map(module =>
			this.module.getModule(module),
		);

		// @TODO: Need to bind all providers in nested exports hierarchy
		modules.forEach(module => {
			const bind = (module: Module) => {
				module.exports.forEach(ref => {
					const providerRef = this.module.getProvider(module.target, <any>ref);

					this.module.providers.bind(<any>ref)
						.toConstantValue(providerRef)
						.whenInjectedInto(provider.provide || provider);

					const moduleRef = this.module.getModule(ref);
					if (moduleRef.exports) return bind(moduleRef);
				});
			};

			return bind(module);
		});
	}

	private bind(type: PROVIDER_TYPES, provider) {
		// @TODO: useExisting
		if (type === PROVIDER_TYPES.DEFAULT) {
			const scope = this.resolveProviderScope(provider);
			this.bindProvider(scope, provider);
		} else if (type === PROVIDER_TYPES.FACTORY) {
			this.bindFactoryProvider(provider);
		} else if (type === PROVIDER_TYPES.VALUE) {
			this.bindValueProvider(provider);
		} else if (type === PROVIDER_TYPES.CLASS) {
			this.bindClassProvider(provider);
		}
	}

	public async resolve() {
		this.providers.forEach(provider => {
			const type = this.getProviderType(provider);

			if (type !== PROVIDER_TYPES.DEFAULT && !(<MultiDepsProvider>provider).multi) {
				if (this.module.providers.isBound((<ProvideToken>provider).provide)) {
					throw new Error(`Provider: ${(<ProvideToken>provider).provide.toString()} is already bound. Flag as multi.`);
				}
			}

			this.resolveDependencies(provider);
			this.bind(type, provider);
		});
	}

}
