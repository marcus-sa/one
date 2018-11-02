import { RouteInfo } from '../interfaces';
import { filterMiddleware } from './utils';
import { MiddlewareBuilder } from './middleware-builder';

export class MiddlewareConfigProxy {
  private contextParameters: any[];
  private excludedRoutes: RouteInfo[] = [];
  private readonly includedRoutes: any[];

  constructor(private readonly builder: MiddlewareBuilder, middleware: any[]) {
    this.includedRoutes = filterMiddleware(middleware);
  }

  public getExcludedRoutes() {
    return this.excludedRoutes;
  }

  public with(...args: any[]) {
    this.contextParameters = args;
    return this;
  }

  public exclude(...routes: Array<string | RouteInfo>) {
    this.excludedRoutes = this.mapRoutesToFlatList(
      routes.map(route => this.builder.routesMapper.mapRouteToRouteInfo(route)),
    );

    return this;
  }
}