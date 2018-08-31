import { DependenciesScanner, ModuleContainer } from './module';
import { APP_INITIALIZER } from './constants';
import { Registry } from './registry';
import { Type } from './interfaces';

// @TODO: Figure out why <https://github.com/inversify/InversifyJS/blob/master/wiki/hierarchical_di.md> doesn't work
export class Factory {
  private readonly container = new ModuleContainer();
  private readonly registry = new Registry(this.container);
  private readonly scanner = new DependenciesScanner(this.container);

  constructor(private readonly module: Type<any>) {}

  public async start() {
    await this.scanner.scan(this.module);

    await Promise.all(this.container.getAllProviders(<any>APP_INITIALIZER));
  }
}
