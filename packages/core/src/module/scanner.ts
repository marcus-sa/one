import { CircularDependencyException } from '../errors';
import { OneContainer } from './container';
import { Reflector } from '../reflector';
import { METADATA } from '../constants';
import { Registry } from '../registry';
import { OneModule } from './module';
import { Utils } from '../util';
import {
  ModuleExport,
  DynamicModule,
  ForwardRef,
  ModuleImport,
  Provider,
  Token,
  Type,
} from '../interfaces';

export class Scanner {
  constructor(private readonly container: OneContainer) {}

  public async scan(module: Type<OneModule>) {
    await this.scanForModules(module);
    await this.scanModulesForDependencies();
    this.container.bindGlobalScope();
    await this.createModules();
  }

  private async createModules() {
    const traverse = async (module: OneModule) => {
      const imports = module.imports.values();
      for (const innerModule of imports) {
        await traverse(innerModule);
      }

      await Promise.all([...imports].map(({ created }) => created));
      await module.create();
      this.container.moduleOrder.add(module);
    };

    const rootModule = this.container
      .getModules()
      .values()
      .next().value;
    await traverse(rootModule);
  }

  private async scanForModules(
    module: ModuleImport,
    scope: Type<OneModule>[] = [],
    ctxRegistry: ModuleImport[] = [],
  ) {
    await this.storeModule(module, scope);
    ctxRegistry.push(module);

    if (Registry.hasForwardRef(module)) {
      module = (<ForwardRef>module).forwardRef();
    }

    const imports = Reflector.get(METADATA.IMPORTS, <Type<OneModule>>module);
    const modules = Registry.isDynamicModule(module)
      ? [...imports, ...(module.imports || [])]
      : imports;

    for (const innerModule of modules) {
      if (ctxRegistry.includes(innerModule)) continue;

      const scopedModules = Utils.concat(scope, module);
      await this.scanForModules(innerModule, scopedModules, ctxRegistry);
    }
  }

  private async storeModule(
    module: Partial<ModuleImport>,
    scope: Type<OneModule>[],
  ) {
    if (Registry.hasForwardRef(module)) {
      return await this.container.addModule(
        (<ForwardRef>module).forwardRef(),
        scope,
      );
    }

    await this.container.addModule(module, scope);
  }

  public async storeImport(
    related: ModuleImport,
    token: string,
    context: string,
  ) {
    if (!related) throw new CircularDependencyException(context);

    if (Registry.hasForwardRef(related)) {
      return await this.container.addImport(
        (<ForwardRef>related).forwardRef(),
        token,
      );
    }

    await this.container.addImport(
      <Type<OneModule> | DynamicModule>related,
      token,
    );
  }

  public async scanModulesForDependencies() {
    const modules = this.container.getReversedModules();

    for (const [token, module] of modules) {
      await this.reflectImports(module.target, token, module.target.name);
      await this.reflectProviders(module.target, token);
      this.reflectExports(module.target, token);
    }
  }

  private async reflectProviders(module: Type<OneModule>, token: string) {
    const providers = this.getDynamicMetadata<Provider>(
      module,
      token,
      METADATA.PROVIDERS as 'providers',
    );

    for (const provider of providers) {
      await this.storeProvider(provider, token);
    }
  }

  private async storeProvider(provider: Provider, token: string) {
    await this.container.addProvider(provider, token);
  }

  private getDynamicMetadata<T = Token>(
    module: Type<OneModule>,
    token: string,
    metadataKey: keyof DynamicModule,
  ): T[] {
    return [
      ...Reflector.get(metadataKey, module),
      ...this.container.getDynamicMetadataByToken(token, metadataKey),
    ];
  }

  private reflectExports(module: Type<OneModule>, token: string) {
    const exports = this.getDynamicMetadata<ModuleExport>(
      module,
      token,
      METADATA.EXPORTS as 'exports',
    );

    exports.forEach(exportedComponent =>
      this.storeExported(exportedComponent, token),
    );
  }

  private storeExported(component: ModuleExport, token: string) {
    this.container.addExported(component, token);
  }

  private async reflectImports(
    module: Type<OneModule>,
    token: string,
    context: string,
  ) {
    const modules = this.getDynamicMetadata<ModuleImport>(
      module,
      token,
      METADATA.IMPORTS as 'imports',
    );

    for (const related of modules) {
      await this.storeImport(related, token, context);
    }
  }
}
