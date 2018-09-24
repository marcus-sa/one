import { Scanner, NestContainer } from './module';
import { APP_INITIALIZER } from './tokens';
import { ExceptionsZone } from './errors';
import { Type } from './interfaces';
import { NestModule } from './module';
import { Utils } from './util';

// @TODO: Figure out why <https://github.com/inversify/InversifyJS/blob/master/wiki/hierarchical_di.md> doesn't work
export class Factory {
  private readonly container = new NestContainer();
  private readonly scanner = new Scanner(this.container);

  constructor(private readonly module: Type<NestModule>) {}

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
