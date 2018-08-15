import { Container } from 'inversify';

import { ModuleMetadata, Type } from '../interfaces';
import { ProviderFactory } from './provider-factory';
import { APP_INITIALIZER, Injector, METADATA } from '../constants';

// @TODO: Fix type declarations
export class Module {

	public readonly providers = new Container();
	public exports: any[];// Array<symbol | Type<any>>;
	public imports: Type<any>[];

	constructor(
		private readonly modulesContainer: Container,
		private readonly modulesRef: Container,
		public readonly target: Type<any>,
	) {}

	private getModuleMetadata(key: string): ModuleMetadata {
		return Reflect.hasMetadata(key, this.target)
			? Reflect.getMetadata(key, this.target)
			: [];
	}

	private resolveMetadata() {
		return Object.keys(METADATA).reduce<ModuleMetadata>((metadata, key) => {
			return {
				...metadata,
				[METADATA[key]]: this.getModuleMetadata(METADATA[key]),
			};
		}, {});
	};

	public getModule(module: any) {
		return this.modulesContainer.get<Module>(module);
	}

	public getProvider(module, provider: any) {
		const moduleRef = this.getModule(module);

		if (moduleRef.providers.isBound(provider)) {
			return moduleRef.providers.get(provider);
		}
	}

	private async resolveDependencies() {
		await Promise.all(
			this.imports.map(async (moduleRef) => {
				if (this.modulesRef.isBound(moduleRef)) return;
				const module = new Module(
					this.modulesContainer,
					this.modulesRef,
					moduleRef,
				);
				await module.create();
			}),
		);
	}

	public async create() {
		if (this.modulesRef.isBound(this.target)) return;
		const metadata = this.resolveMetadata();
		this.imports = metadata.imports;
		this.exports = metadata.exports;

		this.providers.bind(Injector).toConstantValue(this.providers);

		await this.resolveDependencies();

		const providerFactory = new ProviderFactory(metadata.providers, this);
		await providerFactory.resolve();

		// @TODO: Instantiate module before or after metadata has been resolved ?
		this.modulesContainer.bind(this.target).toConstantValue(this);
		this.modulesRef.bind(this.target).toSelf();

		if (this.providers.isBound(APP_INITIALIZER)) {
			this.providers.getAll(APP_INITIALIZER);
		}
	}

}
