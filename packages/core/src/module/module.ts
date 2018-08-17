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
	Provider,
	Type,
} from '../interfaces';

// @TODO: Fix type declarations
export class Module {

	public readonly providers = new Container({
		autoBindInjectable: true,
	});
	public exports: ModuleExport[];
	public imports: ModuleImport[];

	constructor(
		private readonly modulesContainer: Container,
		private readonly moduleRefs: Container,
		public readonly registry: Registry,
		private readonly _target: ModuleImport,
	) {}

	public get target(): Type<any> {
		return typeof this._target !== 'function'
			? (<DynamicModule>this._target).module
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

	public getModule(module: ModuleImport) {
		return this.modulesContainer.get<Module>((<DynamicModule>module).module || (<Type<any>>module));
	}

	public getModuleRef(module: ModuleImport) {
		return this.moduleRefs.get<Type<any>>((<DynamicModule>module).module || (<Type<any>>module));
	}

	public getProvider(module: Type<any>, provider: Provider) {
		const token = this.registry.getProviderToken(provider);
		const moduleRef = this.registry.modules.get(module);

		if (moduleRef.providers.isBound(token)) {
			return moduleRef.providers.get(token);
		}
	}

	private async resolveDependencies() {
		await Promise.all(
			this.imports.map(async (moduleRef: Type<any>) => {
				if (this.moduleRefs.isBound(moduleRef)) return;
				const module = new Module(
					this.modulesContainer,
					this.moduleRefs,
					this.registry,
					moduleRef,
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
		// this.providerMetadata = metadata.providers;
	}

	private bindGlobalProviders() {
		this.providers.bind(Injector).toConstantValue(this.providers);
		this.moduleRefs.bind(Injector)
			.toConstantValue(this.providers)
			.whenInjectedInto(<any>this.target);

		this.providers.bind(Registry).toConstantValue(this.registry);
		this.moduleRefs.bind(Registry)
			.toConstantValue(this.registry)
			.whenInjectedInto(<any>this.target);
	}

	public async create() {
		if (this.moduleRefs.isBound(<any>this.target)) return;
		const metadata = this.resolveMetadata();
		await this.createMetadata(metadata);
		this.bindGlobalProviders();
		await this.resolveDependencies();

		const providerFactory = new ProviderFactory(metadata.providers, this);
		await providerFactory.resolve();

		// @TODO: Instantiate module before or after metadata has been resolved ?
		// this.modulesContainer.bind(<any>this.target).toConstantValue(this);
		this.moduleRefs.bind(<any>this.target).toSelf();
		this.registry.modules.set(this.target, this);

		// @TODO: Make use factories async resolved
		/*if (this.providers.isBound(APP_INITIALIZER)) {
			await Promise.all(this.providers.getAll(APP_INITIALIZER));
		}*/

		const module = this.moduleRefs.get(<any>this.target);

		((<OnModuleInit>module).onModuleInit && await (<OnModuleInit>module).onModuleInit());
	}

}
