import 'reflect-metadata';
import { Injectable, Module, ModuleCompiler, Registry } from '@nest/core';

describe('ModuleCompiler', () => {
  let compiler: ModuleCompiler;

  @Module()
  class TestModule {}

  @Injectable()
  class Nest {}

  beforeEach(() => {
    compiler = new ModuleCompiler();
  });

  describe('compile', () => {
    it('should compile <Type<NestModule>>', async () => {
      const moduleFactory = await compiler.compile(TestModule);

      expect(moduleFactory).toContainAllEntries([
        ['target', TestModule],
        ['dynamicMetadata', undefined],
        ['token', expect.toBeString()],
      ]);
    });

    it('should compile <InjectionToken>', async () => {});

    it('should compile <DynamicModule>', async () => {
      TestModule.forRoot = () => ({
        module: TestModule,
        exports: [Nest],
      });

      const moduleFactory = await compiler.compile(TestModule.forRoot());

      expect(moduleFactory).toContainEntries([
        ['target', TestModule],
        ['dynamicMetadata', expect.toBeObject()],
        ['token', expect.toBeString()],
      ]);

      expect(moduleFactory.dynamicMetadata).toHaveProperty('exports', [Nest]);
    });

    it('should compile <Promise<DynamicModule>>', async () => {
      const moduleFactory = await compiler.compile(
        Promise.resolve({ module: TestModule }),
      );

      expect(moduleFactory).toContainAllEntries([
        ['target', TestModule],
        ['dynamicMetadata', expect.toBeObject()],
        ['token', expect.toBeString()],
      ]);
    });

    it('should compile <Dependency>', async () => {
      const moduleFactory = await compiler.compile(Nest);

      expect(moduleFactory).toContainAllEntries([
        ['target', Nest],
        ['dynamicMetadata', undefined],
        ['token', expect.toBeString()],
      ]);
    });
  });

  describe('extractMetadata', () => {
    let isDynamicModuleSpy: jest.SpyInstance;

    beforeEach(() => {
      isDynamicModuleSpy = jest.spyOn(Registry, 'isDynamicModule');
    });

    afterEach(() => isDynamicModuleSpy.mockClear());

    it('should return with target when <Type<Injectable>> is provided', async () => {
      const moduleFactory = await (<any>compiler).extractMetadata(Nest);

      expect(isDynamicModuleSpy).toHaveReturnedWith(false);
      expect(moduleFactory).toContainAllEntries([['target', Nest]]);
    });

    it('should return <ModuleFactory> when <Type<NestModule>> is provided', async () => {
      const moduleFactory = await (<any>compiler).extractMetadata(TestModule);

      expect(isDynamicModuleSpy).toHaveReturnedWith(false);
      expect(moduleFactory).toContainAllEntries([['target', TestModule]]);
    });

    it('should return <ModuleFactory> when <DynamicModule> is provided', async () => {
      const moduleFactory = await (<any>compiler).extractMetadata({
        module: TestModule,
      });

      expect(isDynamicModuleSpy).toHaveReturnedWith(true);
      expect(moduleFactory).toContainAllEntries([
        ['target', TestModule],
        ['dynamicMetadata', expect.toBeObject()],
      ]);
    });
  });
});
