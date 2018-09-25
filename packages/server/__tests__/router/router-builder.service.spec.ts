import { Controller, RequestMapping, RequestMethod } from '@nest/server';
import { RouterBuilder } from '@nest/server/router';
import { Injector } from '@nest/core';

describe('RouterBuilder', () => {
  let injector: Injector;
  let routerBuilder: RouterBuilder;

  @Controller('global')
  class TestRoute {
    @RequestMapping('test')
    public getTest() {}

    @RequestMapping('test', RequestMethod.POST)
    public postTest() {}

    @RequestMapping('another-test', RequestMethod.ALL)
    public anotherTest() {}
  }

  beforeEach(() => {
    injector = new Injector();
    routerBuilder = new RouterBuilder(injector);

    injector.bind(TestRoute).toSelf();
  });

  describe('exploreMethodMetadata', () => {
    it('should method return expected object which represent single route', () => {
      const route = routerBuilder.exploreMethodMetadata(
        TestRoute,
        'getTest',
      );

      expect(route.path).toEqual('/test');
      expect(route.requestMethod).toEqual(RequestMethod.GET);
      expect(route.targetCallback).toEqual(TestRoute.prototype.getTest);
    });
  });
});