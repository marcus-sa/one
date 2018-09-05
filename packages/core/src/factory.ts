import { Scanner, ModuleContainer } from './module';
import { APP_INITIALIZER } from './constants';
import { ExceptionsZone } from './errors';
import { Type } from './interfaces';
import { Module } from './module';
import { Utils } from './util';

// @TODO: Figure out why <https://github.com/inversify/InversifyJS/blob/master/wiki/hierarchical_di.md> doesn't work
export class Factory {
  private readonly container = new ModuleContainer();
  private readonly scanner = new Scanner(this.container);

  constructor(private readonly module: Type<Module>) {}

  public async start() {
    await ExceptionsZone.run(async () => {
      await this.scanner.scan(this.module);
      await this.initialize();
    });
  }

  private async initialize() {
    await Utils.series(
      this.container.getAllProviders(APP_INITIALIZER),
    );
  }
}
