import { Container } from 'inversify';

import { APP_INITIALIZER, ModuleRefs } from './constants';
import { Registry } from './registry';
import { Type } from './interfaces';
import { Module } from './module';

// @TODO: Figure out why <https://github.com/inversify/InversifyJS/blob/master/wiki/hierarchical_di.md> doesn't work
export class Factory {
  private readonly moduleRefs = new Container({
    autoBindInjectable: true,
    defaultScope: 'Singleton',
  });

  private readonly registry = new Registry();

  constructor(private readonly module: Type<any>) {}

  public async start() {
    const module = new Module(this.moduleRefs, this.registry, this.module);
    module.root = true;
    await module.create();

    console.log('Before: APP_INITIALIZER');
    await Promise.all(this.registry.getAllProviders(<any>APP_INITIALIZER));
    console.log('After: APP_INITIALIZER');

    return module;
  }
}
