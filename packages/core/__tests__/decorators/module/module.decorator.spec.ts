import 'reflect-metadata';
import { Injectable, Module, ModuleWithProviders } from '@nest/core';
import { Testing } from '@nest/testing';

describe('@Module()', () => {
  it('should accept module import', async () => {
    @Module()
    class TestModule {}

    const fixture = await Testing.create({
      imports: [TestModule],
    }).compile();

    const testModule = fixture.container.getModule(TestModule);

    expect(testModule.target).toStrictEqual(TestModule);
    expect(fixture.container.modules.size).toStrictEqual(2);

    const modules = fixture.container.getModules().values();
    const imports = modules.next().value.imports.values();
    expect(imports.next().value.target).toStrictEqual(TestModule);
  });
  /*it('should accept module with providers', async () => {
    @Injectable()
    class TestService {}

    @Module()
    class TestModule {
      static forRoot(): ModuleWithProviders {
        return {
          module: TestModule,
          providers: [TestService],
        };
      }
    }

    const module = await bootstrap(TestModule.forRoot());

    expect(module.target).toStrictEqual(TestModule);
    expect(module.providers.get(TestService)).toBeTruthy();
  });*/

  it('should accept module with providers', async () => {
    @Injectable()
    class TestService {}

    @Module()
    class TestModule {
      static forRoot(): ModuleWithProviders {
        return {
          module: TestModule,
          providers: [TestService],
        };
      }
    }

    const fixture = await Testing.create({
      imports: [TestModule.forRoot()],
    }).compile();

    const testModule = fixture.container.getModule(TestModule);
    const appModule = fixture.container.getModuleValues()[0];

    expect(testModule.target).toStrictEqual(TestModule);
    expect(fixture.container.isProviderBound(TestService)).toBeTruthy();
    expect(fixture.container.getProvider(TestService, testModule.target)).toBeInstanceOf(TestService);
    expect(testModule.providers.get(TestService)).toBeInstanceOf(TestService);
    expect(() => appModule.providers.get(TestService)).toThrowError();
  });
  it('should accept dynamic imports', () => {

  });
  it('should accept async dynamic imports', () => {

  });
});
