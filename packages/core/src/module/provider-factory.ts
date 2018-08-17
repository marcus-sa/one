import 'reflect-metadata';

import { PROVIDER_TYPES, SCOPE, SCOPES } from '../constants';
import { Module } from './module';
import {
	ClassProvider,
	ExistingProvider,
	FactoryProvider,
	MultiDepsProvider,
	Provider,
	ProvideToken,
	Type,
	ValueProvider,
} from '../interfaces';

export class ProviderFactory {

	constructor(
		private readonly providers: Provider[],
		private readonly module: Module,
	) {}

	private getDependencies(dependencies: Provider[] = []) {
		return dependencies.map(dependency =>
			this.module.registry.getDependencyFromTree(this.module, dependency)
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

		// return new Promise((resolve, reject) => {
			/*const next = async (factory: Promise<Function>) => {
				try {
					const result = await factory;
					resolve();
					console.log(result);
					return result;
				} catch (e) {
					reject(e);
				}
			};*/

			if (provider.scope === SCOPES.TRANSIENT) {
				this.module.providers.bind(provider.provide)
					.toDynamicValue(() => provider.useFactory(...deps()));
			}

			this.module.providers.bind(provider.provide)
				.toProvider(() => provider.useFactory(...deps()));
		//});
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

	private resolveDependencies(provider: Provider) {
		const modules = this.module.imports.map(module =>
			this.module.registry.modules.get(<any>module),
		);

		// @TODO: Need to bind all providers in nested exports hierarchy
		modules.forEach(module => {
			const bind = (module: Module) => {
				module.exports.forEach(ref => {
					if (!this.module.registry.isModuleRef(ref) && !this.module.providers.isBound(<any>ref)) {
						const providerRef = this.module.getProvider(module.target, <any>ref);

						this.module.providers.bind(<any>ref)
							.toConstantValue(providerRef)
							.whenInjectedInto(<any>this.module.registry.getProviderToken(provider));
					}

					const moduleRef = this.module.getModule(<any>ref);
					if (this.module.registry.isModule(moduleRef)) bind(moduleRef);
				});
			};

			bind(module);
		});
	}

	private async bind(type: PROVIDER_TYPES, provider: Provider) {
		// @TODO: useExisting
		if (type === PROVIDER_TYPES.DEFAULT) {
			const scope = this.resolveProviderScope(<Type<any>>provider);
			this.bindProvider(scope, <Type<any>>provider);
		} else if (type === PROVIDER_TYPES.FACTORY) {
			await this.bindFactoryProvider(<FactoryProvider>provider);
		} else if (type === PROVIDER_TYPES.VALUE) {
			this.bindValueProvider(<ValueProvider>provider);
		} else if (type === PROVIDER_TYPES.CLASS) {
			this.bindClassProvider(<ClassProvider>provider);
		}
	}

	public async resolve() {
		await Promise.all(
			this.providers.map(async (provider) => {
				if (this.module.registry.isProviderBound(provider)) return;
				const type = this.getProviderType(provider);

				if (type !== PROVIDER_TYPES.DEFAULT && !(<MultiDepsProvider>provider).multi) {
					if (this.module.providers.isBound((<ProvideToken>provider).provide)) {
						throw new Error(`Provider: ${(<ProvideToken>provider).provide.toString()} is already bound. Flag as multi.`);
					}
				}

				await this.bind(type, provider);
				this.resolveDependencies(provider);
			}),
		);
	}

}
