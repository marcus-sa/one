import { Container } from 'inversify';

import { OnInit, ModuleMetadata, Type, ModuleWithProviders } from '../interfaces';
import { ProviderFactory } from './provider-factory';
import { APP_INITIALIZER, Injector, METADATA } from '../constants';

// @TODO: Fix type declarations
export class Module {

	public readonly providers = new Container();
	public exports: any[];// Array<symbol | Type<any>>;
	public imports: Array<ModuleWithProviders | Type<any>>;

	constructor(
		private readonly modulesContainer: Container,
		private readonly modulesRef: Container,
		public readonly _target: ModuleWithProviders | Type<any>,
	) {}

	public get target(): Type<any> {
		return typeof this._target !== 'function'
			? <any>this._target.module
			: this._target;
	}

	private getModuleMetadata(key: string): ModuleMetadata {
		return typeof this.target === 'function'
			? Reflect.hasMetadata(key, this.target)
				? Reflect.getMetadata(key, this.target)
				: []
			: this.target[key] || [];
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
		return this.modulesContainer.get<Module>(module.module || module);
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
				if (this.modulesRef.isBound(<any>moduleRef)) return;
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
		if (this.modulesRef.isBound(<any>this.target)) return;
		const metadata = this.resolveMetadata();
		this.imports = metadata.imports;
		this.exports = metadata.exports;

		this.providers.bind(Injector).toConstantValue(this.providers);

		await this.resolveDependencies();

		const providerFactory = new ProviderFactory(metadata.providers, this);
		await providerFactory.resolve();

		// @TODO: Instantiate module before or after metadata has been resolved ?
		this.modulesContainer.bind(<any>this.target).toConstantValue(this);
		this.modulesRef.bind(<any>this.target).toSelf();

		console.log(`before APP_INITIALIZER`);

		if (this.providers.isBound(APP_INITIALIZER)) {
			console.log(this.providers.getAll(APP_INITIALIZER));
		}

		console.log(`after APP_INITIALIZER`);

		const module = this.modulesRef.get(<any>this.target);

		((<OnInit>module).onInit && await (<OnInit>module).onInit());
	}

}
