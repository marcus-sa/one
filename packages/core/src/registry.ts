import { Type } from './interfaces';
import { Module } from './module';

export class Registry {

	public readonly modules = new Map<Type<any>, Module>();

	public static flatten(arr: any[][]) {
		return arr.reduce((previous, current) => [...previous, ...current]);
	}

	public getModule(target: Type<any>) {
		return [...this.modules.values()].find(
			module => module.target.constructor === target.constructor,
		);
	}

	public getProvider(provider: Type<any> | symbol) {
		for (const module of this.modules.values()) {
			if (module.providers.isBound(provider)) {
				return module.providers.get(provider);
			}
 		}
	}

	public getAllProviders(provider: Type<any> | symbol) {
		const providers = [...this.modules.values()].map(module => {
			return module.providers.isBound(provider)
				? module.providers.getAll(provider)
				: [];
		});

		return Registry.flatten(providers);
	}

	public isProviderBound(provider: Type<any> | symbol) {
		return [...this.modules.values()].some(module =>
			module.providers.isBound(provider),
		);
	}

}