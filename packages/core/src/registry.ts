import { Provider, Type, ProvideToken } from './interfaces';
import { Module } from './module';

export class Registry {

	public readonly modules = new Map<Type<any>, Module>();

	public static flatten(arr: any[][]) {
		return arr.reduce((previous, current) => [...previous, ...current]);
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

	public getDependencyFromTree(module: Module, dependency: Provider) {
		const token = this.getProviderToken(dependency);
		const modules = new Set();
		const tree = new Set();
		let provider: Type<any>;

		const findDependency = (module: Module) => {
			if (!this.isModule(module) || modules.has(module)) return false;

			modules.add(module);
			tree.add(module.target.name);

			module.imports.forEach(moduleRef => {
				const imported = this.getModule(<Type<any>>moduleRef);

				// @TODO: Need to figure out where we are in the loop so we can check if the module exists in exports
				const isModuleExported = imported.imports.every(module => {
					return imported.exports.includes(module);
				});

				isModuleExported && findDependency(imported);
			});

			module.exports.forEach(moduleRef => {
				const exported = this.getModule(<Type<any>>moduleRef);

				if (moduleRef === dependency) {
					// provider = exported.providers.get(token);
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
			throw new Error(`Couldn't find provider ${this.getProviderName(dependency)} in tree: ${[...tree].join(' -> ')}`);
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
