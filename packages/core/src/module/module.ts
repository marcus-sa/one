import { Container } from 'inversify';

import { Injector, METADATA } from '../constants';
import { ProviderFactory } from './provider-factory';
import { Registry } from '../registry';
import {
	ModuleMetadata,
	DynamicModule,
	ModuleImport,
	ModuleExport,
	OnModuleInit,
	Type,
} from '../interfaces';

// @TODO: Fix type declarations
export class Module {

	public readonly providers = new Container();
	public exports: ModuleExport[];
	public imports: ModuleImport[];

	constructor(
		private readonly modulesContainer: Container,
		private readonly modulesRef: Container,
		private readonly registry: Registry,
		private readonly _target: Type<any> | DynamicModule,
	) {}

	public get target(): Type<any> {
		return typeof this._target !== 'function'
			? <any>this._target.module
			: this._target;
	}

	private getModuleMetadata(key: string): ModuleMetadata {
		return (typeof this.target === 'function'
			? Reflect.getMetadata(key, this.target)
			: this.target[key]
		) || [];
	}

	private resolveMetadata() {
		return Object.keys(METADATA).reduce<ModuleMetadata>((metadata, key) => {
			return {
				...metadata,
				[METADATA[key]]: this.getModuleMetadata(METADATA[key]),
			};
		}, {});
	};

	public getModule(module: any): Module {
		return this.modulesContainer.get<Module>(module.module || module);
	}

	public getModuleRef(module: any) {
		return this.modulesRef.get<Type<any>>(module.module || module);
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
					this.registry,
					<any>moduleRef,
				);
				await module.create();
			}),
		);
	}

	private async createMetadata(metadata: ModuleMetadata) {
		this.imports = await Promise.all(
			<Promise<ModuleImport>[]>metadata.imports,
		);
		this.exports = await Promise.all(
			<Promise<ModuleExport>[]>metadata.exports,
		);
	}

	private bindScopeDefaults() {
		this.providers.bind(Injector).toConstantValue(this.providers);
		this.modulesRef.bind(Injector)
			.toConstantValue(this.providers)
			.whenInjectedInto(<any>this.target);

		this.providers.bind(Registry).toConstantValue(this.registry);
		this.modulesRef.bind(Registry)
			.toConstantValue(this.registry)
			.whenInjectedInto(<any>this.target);
	}

	public async create() {
		if (this.modulesRef.isBound(<any>this.target)) return;
		const metadata = this.resolveMetadata();
		await this.createMetadata(metadata);
		this.bindScopeDefaults();
		await this.resolveDependencies();

		const providerFactory = new ProviderFactory(metadata.providers, this);
		await providerFactory.resolve();

		// @TODO: Instantiate module before or after metadata has been resolved ?
		this.modulesContainer.bind(<any>this.target).toConstantValue(this);
		this.modulesRef.bind(<any>this.target).toSelf();
		this.registry.modules.set(this.target, this);

		// @TODO: Make use factories async resolved
		/*if (this.providers.isBound(APP_INITIALIZER)) {
			await Promise.all(this.providers.getAll(APP_INITIALIZER));
		}*/

		const module = this.modulesRef.get(<any>this.target);

		((<OnModuleInit>module).onModuleInit && await (<OnModuleInit>module).onModuleInit());
	}

}
