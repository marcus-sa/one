import {
  APP_DESTROY,
  APP_INIT,
  InjectionToken,
  Module,
  MODULE_INIT,
  ModuleMetadata,
  Utils,
} from '@one/core';
import { Test } from '@one/testing';

describe('Default <InjectionToken[]>', () => {
  let seriesSpy: jest.SpyInstance;

  function createProviders(
    provide: InjectionToken<any>,
    factory: string,
  ): ModuleMetadata {
    return {
      providers: [
        {
          provide,
          useFactory: () => factory,
          multi: true,
        },
      ],
    };
  }

  beforeEach(() => {
    seriesSpy = jest.spyOn(Utils, 'series');
  });

  afterEach(() => seriesSpy.mockClear());

  describe('APP_INIT', () => {
    it('should instantiate providers in hierarchical order', async () => {
      @Module(createProviders(APP_INIT, 'first'))
      class TestModule {}

      const test = Test.createTestingModule({
        imports: [TestModule],
        ...createProviders(APP_INIT, 'second'),
      });

      await test.scanner.scan(test.module);

      const providers = test.container.getAllProviders(APP_INIT);
      expect(providers[0]).toEqual('first');
      expect(providers[1]).toEqual('second');
    });
  });

  describe('APP_DESTROY', async () => {
    @Module(createProviders(APP_DESTROY, 'first'))
    class TestModule {}

    const test = Test.createTestingModule({
      imports: [TestModule],
      ...createProviders(APP_DESTROY, 'second'),
    });

    await test.scanner.scan(test.module);

    const providers = test.container.getAllProviders(APP_DESTROY);
    expect(providers[0]).toEqual('first');
    expect(providers[1]).toEqual('second');
  });

  describe('MODULE_INIT', () => {
    it('should execute factory in hierarchical order', async () => {
      @Module(createProviders(MODULE_INIT, 'first'))
      class TestModule {}

      await Test.createTestingModule({
        imports: [TestModule],
        ...createProviders(MODULE_INIT, 'second'),
      }).compile();

      expect(seriesSpy).toHaveBeenCalledTimes(3);
      expect(seriesSpy).toHaveBeenNthCalledWith(1, ['first']);
      expect(seriesSpy).toHaveBeenNthCalledWith(2, ['second']);
    });
  });

  describe('MODULE_REF', () => {});
});
