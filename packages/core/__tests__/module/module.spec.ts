import { Container } from 'inversify';
import { Registry, Module as ModuleDecorator } from '@one/core';

import { Module } from '../../src/module';

describe('Module', () => {
  let module: Module;

  beforeEach(async () => {
    const moduleRefs = new Container({
      autoBindInjectable: true,
      defaultScope: 'Singleton',
    });

    const registry = new Registry();

    @ModuleDecorator({})
    class AppModule {}

    module = new Module(moduleRefs, registry, AppModule);
  });
});
