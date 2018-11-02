import 'reflect-metadata';
import {
  Injectable,
  Module,
  OneContainer,
  UnknownProviderException,
} from '@one/core';

describe('OneContainer', () => {
  let container: OneContainer;

  @Module()
  class TestModule {}

  @Module()
  class TestModule2 {}

  @Injectable()
  class Nest {}

  beforeEach(() => {
    container = new OneContainer();
  });

  describe('getModules', () => {
    let getModuleValuesSpy: jest.SpyInstance;
    let getModuleSpy: jest.SpyInstance;

    beforeEach(() => {
      getModuleValuesSpy = jest.spyOn(container, 'getModuleValues');
      getModuleSpy = jest.spyOn(container, 'getModule');
    });

    afterEach(() => {
      getModuleValuesSpy.mockClear();
      getModuleSpy.mockClear();
    });

    it('should call getModuleValues if nil', async () => {
      await container.addModule(TestModule);
      const modules = (<any>container).getModulesFrom();
      const testModule = container.modules.values().next().value;

      expect(getModuleSpy).not.toHaveBeenCalled();
      expect(getModuleValuesSpy).toHaveBeenCalled();
      expect(modules[0]).toStrictEqual(testModule);
    });

    it('should call getModule if not nil', async () => {
      await container.addModule(TestModule);
      const modules = (<any>container).getModulesFrom(<any>TestModule);
      const testModule = container.modules.values().next().value;

      // Calls with [] ????
      // expect(getModuleValuesSpy).not.toHaveBeenCalled();
      expect(getModuleSpy).toReturnWith(testModule);
      expect(modules[0]).toStrictEqual(testModule);
    });
  });

  describe('isProviderBound', () => {
    it('should check if provider is bound in modules tree', async () => {
      await container.addModule(TestModule);
      const testModule = container.modules.values().next().value;

      await (<any>testModule).bindProvider(<any>Nest);

      expect(container.isProviderBound(Nest)).toBeTrue();
    });

    it('should check if provider is bound in specific module', async () => {
      await container.addModule(TestModule);
      await container.addModule(TestModule2);
      const testModule = container.modules.values().next().value;

      await (<any>testModule).bindProvider(<any>Nest);

      expect(container.isProviderBound(Nest, TestModule2)).toBeFalse();
      expect(container.isProviderBound(Nest, TestModule)).toBeTrue();
    });
  });

  describe('getProvider', () => {
    it('should get provider in nested modules tree', async () => {
      await container.addModule(TestModule);
      await container.addModule(TestModule2);
      const testModule2 = container.getModuleValues()[1];

      await (<any>testModule2).bindProvider(<any>Nest);

      await expect(container.getProvider(Nest, null)).toBeInstanceOf(Nest);
    });

    it('should lookup provider in scope when strict is true', async () => {
      await container.addModule(TestModule);
      const testModule = container.modules.values().next().value;

      await (<any>testModule).bindProvider(<any>Nest);

      expect(
        container.getProvider(Nest, TestModule, {
          strict: true,
        }),
      ).toBeInstanceOf(Nest);
    });

    it('should throw UnknownProviderException if not found', () => {
      const message = new UnknownProviderException(Nest, TestModule);

      expect(() => {
        container.getProvider(Nest, TestModule);
      }).toThrow(message);
    });
  });
});
