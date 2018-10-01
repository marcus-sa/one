import { Injectable, Type, Utils } from '@nest/core';

import { RouterBuilder } from '../router';
import { RouteInfo } from '../interfaces';
import { RequestMethod } from '../enums';
import { MetadataStorage } from '@nest/server/metadata-storage';

@Injectable()
export class RoutesMapper {
  constructor(private readonly routerBuilder: RouterBuilder) {}

  public mapRouteToRouteInfo(
    route: Type<any> | RouteInfo | string
  ): RouteInfo[] {
    if (Utils.isString(route)) {
      return [{
        path: this.routerBuilder.validateRoutePath(route),
        method: RequestMethod.ALL,
      }];
    }

    const routePath = MetadataStorage.getControllerPath(route);
    if (this.isRouteInfo(routePath, route)) {
      return [{
        path: this.routerBuilder.validateRoutePath(route.path),
        method: route.method,
      }];
    }

    return this.routerBuilder.scanForPaths(route)
      .map(item => ({
        path: this.validateGlobalPath(routePath) + this.routerBuilder.validateRoutePath(item.path),
        method: item.requestMethod,
      }));
  }

  private validateGlobalPath(path: string): string {
    const prefix = this.routerBuilder.validatePath(path);
    return prefix === '/' ? '' : prefix;
  }

  private isRouteInfo(
    path: string | undefined,
    objectOrClass: Function | RouteInfo,
  ): objectOrClass is RouteInfo {
    return Utils.isUndefined(path);
  }
}
