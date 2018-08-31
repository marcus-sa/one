import { CircularDependencyException } from '../errors';
import { ModuleContainer } from './container';
import { Reflector } from '../reflector';
import { METADATA } from '../constants';
import { Registry } from '../registry';
import {
  DynamicModule,
  ForwardRef,
  ModuleImport,
  Provider,
  Type,
} from '../interfaces';

export class DependenciesScanner {
  constructor(private readonly container: ModuleContainer) {}

  public async scan(module: Type<any>) {
    await this.scanForModules(module);
    await this.scanModulesForDependencies();
  }

  private async scanForModules(module: ModuleImport, scope: Type<any>[] = []) {
    await this.storeModule(module, scope);

    const imports = Reflector.reflectMetadata(module, METADATA.IMPORTS);
    const modules = Registry.isDynamicModule(module)
      ? [...imports, ...(module.imports || [])]
      : imports;

    for (const innerModule of modules) {
      await this.scanForModules(innerModule, [].concat(scope, module));
    }
  }

  private async storeModule(module: any, scope: Type<any>[]) {
    if (Registry.hasForwardRef(module)) {
      return await this.container.addModule(
        (<ForwardRef>module).forwardRef<any>(),
        scope,
      );
    }

    await this.container.addModule(module, scope);
  }

  public async storeRelatedModule(
    related: Provider,
    token: string,
    context: string,
  ) {
    if (!related) throw new CircularDependencyException(context);

    if (Registry.hasForwardRef(related)) {
      return await this.container.addRelatedModule(
        (<ForwardRef>related).forwardRef<any>(),
        token,
      );
    }

    await this.container.addRelatedModule(<any>related, token);
  }

  public async scanModulesForDependencies() {
    const modules = this.container.getModules();

    for (const [token, { target }] of modules) {
      await this.reflectRelatedModules(target, token, target.name);
      await this.reflectProviders(target, token);
      this.reflectExports(target, token);
    }
  }

  private async reflectProviders(module: Type<any>, token: string) {
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

  private getDynamicMetadata<T = Type<any>>(
    module: Type<any>,
    token: string,
    metadataKey: keyof DynamicModule,
  ): T[] {
    return [
      ...Reflector.reflectMetadata(module, metadataKey),
      ...this.container.getDynamicMetadataByToken(token, metadataKey),
    ];
  }

  private reflectExports(module: Type<any>, token: string) {
    const exports = this.getDynamicMetadata(
      module,
      token,
      METADATA.EXPORTS as 'exports',
    );

    exports.forEach(exportedComponent =>
      this.storeExported(exportedComponent, token),
    );
  }

  private storeExported(component: Type<any>, token: string) {
    this.container.addExported(component, token);
  }

  private async reflectRelatedModules(
    module: Type<any>,
    token: string,
    context: string,
  ) {
    const modules = this.getDynamicMetadata(
      module,
      token,
      METADATA.IMPORTS as 'imports',
    );

    for (const related of modules) {
      await this.storeRelatedModule(related, token, context);
    }
  }
}
