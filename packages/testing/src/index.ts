import { NestFactory, Module, ModuleMetadata } from '@nest/core';

export namespace Testing {
  export type Fixture = NestFactory;

  class ModuleFixture {
    private isCompiled: boolean;

    constructor(
      private readonly factory: NestFactory,
    ) {}

    public async compile() {
      if (this.isCompiled) return this.factory;

      await this.factory.start();
      this.isCompiled = true;
      return this.factory;
    }
  }

  export function createModuleWithMetadata(metadata: ModuleMetadata) {
    @Module(metadata)
    class TestingModule {}

    return TestingModule;
  }

  export function create(metadata: ModuleMetadata) {
    const module = this.createModuleWithMetadata(metadata);
    const factory = new NestFactory(module);
    return new ModuleFixture(factory);
  }
}