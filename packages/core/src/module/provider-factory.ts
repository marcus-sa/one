import 'reflect-metadata';

import { PROVIDER_TYPES, SCOPE, SCOPES } from '../constants';
import { Module } from './module';
import {
	ClassProvider,
	FactoryProvider,
	ValueProvider,
	// Provider,
	Type,
} from '../interfaces';

export class ProviderFactory {

	constructor(
		private readonly providers: any[]/*Provider[]*/,
		private readonly module: Module,
	) {}

	private getDependencies(dependencies: any[]/*Provider[]*/ = []) {
		return dependencies.map(dependency =>
			this.module.providers.get(dependency),
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
			.toProvider(() => provider.useFactory(...deps()));
	}

	private getProviderType(provider: any/*Provider*/): PROVIDER_TYPES {
		if (provider.useFactory) {
			return PROVIDER_TYPES.FACTORY;
		} else if (provider.useValue) {
			return PROVIDER_TYPES.VALUE;
		} else if (provider.useClass) {
			return PROVIDER_TYPES.CLASS;
		} else if (provider.useExisting) {
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
			module.exports.forEach(ref => {
				const providerRef = this.module.getProvider(module.target, ref);

				this.module.providers.bind(ref)
					.toConstantValue(providerRef)
					.whenInjectedInto(provider.provide || provider);
			});
		});
	}

	private async bind(type: PROVIDER_TYPES, provider) {
		// @TODO: useExisting
		if (type === PROVIDER_TYPES.DEFAULT) {
			const scope = this.resolveProviderScope(provider);
			this.bindProvider(scope, provider);
		} else if (type === PROVIDER_TYPES.FACTORY) {
			await this.bindFactoryProvider(provider);
		} else if (type === PROVIDER_TYPES.VALUE) {
			this.bindValueProvider(provider);
		} else if (type === PROVIDER_TYPES.CLASS) {
			this.bindClassProvider(provider);
		}
	}

	public async resolve() {
		const bindings = this.providers.map(async (provider) => {
			const type = this.getProviderType(provider);

			if (type !== PROVIDER_TYPES.DEFAULT && !provider.multi) {
				if (this.module.providers.isBound(provider.provide)) {
					throw new Error(`Provider: ${provider.provide.toString()} is already bound. Flag as multi.`);
				}
			}

			this.resolveDependencies(provider);
			await this.bind(type, provider);
		});

		await Promise.all(bindings);
	}

}
