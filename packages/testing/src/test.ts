import { Module, ModuleMetadata } from '@one/core';

import { TestingModule } from './testing-module';

export class Test {
  private static createModule(metadata: ModuleMetadata) {
    @Module(metadata)
    class TestingModule {}

    return TestingModule;
  }

  public static createTestingModule(metadata: ModuleMetadata) {
    const module = this.createModule(metadata);
    return new TestingModule(module);
  }
}
