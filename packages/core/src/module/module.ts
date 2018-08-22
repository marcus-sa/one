import { Container } from 'inversify';
import getDecorators from 'inversify-inject-decorators';

import { Injector, METADATA, MODULE_INITIALIZER } from '../constants';
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

export class Module {
  public readonly providers = new Container({
    autoBindInjectable: true,
  });
  public readonly lazyInject = getDecorators(this.providers).lazyInject;
  private readonly resolvedModules = new Map<number, Type<any>>();
  public exports: ModuleExport[];
  public imports: Type<any>[];

  constructor(
    private readonly moduleRefs: Container,
    private readonly registry: Registry,
    public readonly target: Type<any>,
  ) {}

  private getModuleMetadata(key: string): ModuleMetadata {
    return Reflect.getMetadata(key, this.target) || [];
  }

  private resolveMetadata() {
    return Object.keys(METADATA).reduce<ModuleMetadata>(
      (metadata, key) => ({
        ...metadata,
        [METADATA[key]]: this.getModuleMetadata(METADATA[key]),
      }),
      {},
    );
  }

  public getModuleRef(module: ModuleImport) {
    return this.moduleRefs.get<Type<any>>(
      (<DynamicModule>module).module || <Type<any>>module,
    );
  }

  public getProvider(module: Type<any>, provider: Provider) {
    const token = this.registry.getProviderToken(provider);
    const moduleRef = this.registry.modules.get(module);

    if (moduleRef.providers.isBound(token)) {
      return moduleRef.providers.get(token);
    }
  }

  public async resolveModule(ref: ModuleImport, i: number) {
    if (!this.resolvedModules.has(i)) {
      const module = await this.registry.resolveModule(ref);
      this.resolvedModules.set(i, module);
      return module;
    }

    return this.resolvedModules.get(i);
  }

  private async resolveDependencies() {
    await Promise.all(
      this.imports.map(async (ref: Type<any>, i) => {
        const moduleRef = await this.resolveModule(ref, i);
        if (this.moduleRefs.isBound(moduleRef)) return;

        const module = new Module(this.moduleRefs, this.registry, moduleRef);

        await module.create();
      }),
    );
  }

  private async resolveMetadataImports(
    imports: Array<ModuleImport | Promise<DynamicModule>>,
  ) {
    return await Promise.all(<Promise<Type<any>>[]>(
      imports.map((ref, i) => this.resolveModule(<any>ref, i))
    ));
  }

  private async createMetadata(metadata: ModuleMetadata) {
    this.imports = await this.resolveMetadataImports(metadata.imports);
    this.exports = await Promise.all(<Promise<ModuleExport>[]>metadata.exports);
  }

  private bindGlobalProviders() {
    this.providers.bind(Injector).toConstantValue(this.providers);
    this.moduleRefs
      .bind(Injector)
      .toConstantValue(this.providers)
      .whenInjectedInto(<any>this.target);

    this.providers.bind(Registry).toConstantValue(this.registry);
    this.moduleRefs
      .bind(Registry)
      .toConstantValue(this.registry)
      .whenInjectedInto(<any>this.target);
  }

  public async create() {
    if (this.moduleRefs.isBound(<any>this.target)) return;
    const metadata = this.resolveMetadata();
    await this.createMetadata(metadata);
    this.bindGlobalProviders();
    await this.resolveDependencies();

    this.moduleRefs.bind(<any>this.target).toSelf();
    this.registry.modules.set(this.target, this);

    const providerFactory = new ProviderFactory(
      metadata.providers,
      this.registry,
      this,
    );
    await providerFactory.resolve();

    console.log(`BEFORE: ${this.target.name} - MODULE_INITIALIZER`);
    if (this.providers.isBound(MODULE_INITIALIZER)) {
      await Promise.all(this.providers.getAll(MODULE_INITIALIZER));
    }
    console.log(`AFTER: ${this.target.name} - MODULE_INITIALIZER`);

    const module = this.moduleRefs.get(<any>this.target);

    (<OnModuleInit>module).onModuleInit &&
      (await (<OnModuleInit>module).onModuleInit());
  }
}
