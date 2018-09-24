import { Injectable, InjectionToken, Module, ModuleMetadata, Type } from '@nest/core';
import { Registry } from '@nest/core/registry';
import { Module as ModuleRef, ModuleContainer, Scanner } from '@nest/core/module';
import { TestService } from '../community-examples/ipfs/src/test.service';

describe('Module', () => {
  let container: ModuleContainer;
  let scanner: Scanner;

  const TEST_TOKEN = new InjectionToken<any>('TEST_TOKEN');

  @Injectable()
  class TestService {}

  beforeEach(() => {
    container = new ModuleContainer();
    scanner = new Scanner(container);
  });

  describe('Module', () => {
    describe('bind', () => {
      it('should bind token to injectable', async () => {
        @Module()
        class AppModule {}

        const appModule = new ModuleRef(AppModule, [], container);
        appModule.addProvider({
          provide: TEST_TOKEN,
          useClass: TestService,
        });
        await appModule.create();

        const testService = appModule.providers.get(
          Registry.getProviderToken(TEST_TOKEN),
        );

        expect(testService).toBeInstanceOf(TestService);
      });

      it('should bind an existing provider to token', async () => {
        @Module()
        class AppModule {}

        const appModule = new ModuleRef(AppModule, [], container);
        appModule.addProvider(TestService);
        appModule.addProvider({
          provide: TEST_TOKEN,
          useExisting: TestService,
        });
        await appModule.create();

        const testService = appModule.providers.get(
          Registry.getProviderToken(TEST_TOKEN),
        );

        expect(testService).toBeInstanceOf(TestService);
      });
    });
  })
});
