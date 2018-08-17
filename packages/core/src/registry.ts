import { Provider, Type, ProvideToken } from './interfaces';
import { Module } from './module';

export class Registry {

	public readonly modules = new Map<Type<any>, Module>();

	public static flatten(arr: any[][]) {
		return arr.reduce((previous, current) => [...previous, ...current]);
	}

	public isModuleRef(ref: any) {
		return this.modules.has(ref);
	}

	public isModule(module: any) {
		return module && module.imports && module.exports;
	}

	public getModule(target: Type<any>): Module {
		return [...this.modules.values()].find(
			module => module.target === target,
		);
	}

	public getProvider(provider: Provider, modules: Module[] | IterableIterator<Module> = this.modules.values()) {
		const token = this.getProviderToken(provider);

		for (const { providers } of modules) {
			if (providers.isBound(token)) {
				return providers.get(token);
			}
 		}
	}

	public static pick<T>(from: any[], by: any[]): T[] {
		return from.filter(f => by.includes(f));
	}

	public getDependencyFromTree(module: Module, dependency: Provider) {
		const token = this.getProviderToken(dependency);
		const modules = new Set<string>();
		let provider: Type<any>;

		const findDependency = (module: Module) => {
			if (!this.isModule(module) || modules.has(module.target.name)) return;

			modules.add(module.target.name);

			module.imports.forEach(moduleRef => {
				const imported = this.getModule(<Type<any>>moduleRef);

				// console.log('findDependency', moduleRef);

				// @TODO: Need to figure out where we are in the loop so we can check if the module exists in exports
				const modules = Registry.pick<Type<any>>(module.imports, module.exports);
				modules && findDependency(imported);
			});

			module.exports.forEach(ref => {
				const exported = this.getModule(<Type<any>>ref);

				if (ref === dependency) {
					provider = module.registry.getProvider(dependency);
					return;
				}

				findDependency(exported);
			});

			if (module.providers.isBound(token)) {
				provider = module.registry.getProvider(dependency);
			}
		};

		findDependency(module);

		if (!provider) {
			// @TODO: Log real modules tree
			throw new Error(`Couldn't find provider ${this.getProviderName(dependency)} in tree: ${[...modules].join(' -> ')}`);
		}

		return provider;
	}

	public getAllProviders(provider: Provider) {
		const token = this.getProviderToken(provider);

		return Registry.flatten(
			[...this.modules.values()].map(({ providers }) => {
				return providers.isBound(token)
					? providers.getAll(token)
					: [];
			}),
		);
	}

	public getProviderName(provider: Provider) {
		return (<ProvideToken>provider).provide
			? (<ProvideToken>provider).provide.toString()
			: (<Type<any>>provider).name;
	}

	public getProviderToken(provider: Provider) {
		return (<ProvideToken>provider).provide || <Type<any>>provider;
	}

	public isProviderBound(provider: Provider) {
		return [...this.modules.values()].some(
			({ providers }) => providers.isBound(this.getProviderToken(provider)),
		);
	}

}
