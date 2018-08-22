import 'reflect-metadata';
import { TestBed } from '@one/testing';
import { bootstrap, Injectable, Module, ModuleWithProviders, Registry } from '@one/core';

describe('@Module()', () => {
  it('should accept module import', async () => {
    @Module()
    class TestModule {}

    const module = await TestBed.create({
      imports: [TestModule],
    });

    expect(module.registry.modules.size).toStrictEqual(2);
    expect([...module.registry.modules.values()][1].imports).toContain(TestModule);
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

    const appModule = await TestBed.create({
      imports: [TestModule.forRoot()],
    });

    const testModule = appModule.registry.modules.get(TestModule);
    expect(testModule.target).toStrictEqual(TestModule);
    expect(appModule.registry.isProviderBound(TestService)).toBeTruthy();
    expect(appModule.registry.getProvider(TestService)).toBeInstanceOf(TestService);
    expect(testModule.providers.get(TestService)).toBeInstanceOf(TestService);
    expect(() => appModule.providers.get(TestService)).toThrowError();
  });
  it('should accept dynamic imports', () => {

  });
  it('should accept async dynamic imports', () => {

  });
});
