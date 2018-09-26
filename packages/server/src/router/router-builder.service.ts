import { Injectable, Injector, Type, Utils } from '@nest/core';

import { UnknownRequestMappingException } from '../errors';
import { MetadataStorage } from '../metadata-storage';
import { RoutePathProperties } from '../interfaces';
import { RouterMethodFactory } from '../helpers';
import { RequestMethod } from '../enums';

@Injectable()
export class RouterBuilder {
  private readonly routerMethodFactory = new RouterMethodFactory();

  constructor(private readonly injector: Injector) {}

  private validatePath(path: string) {
    return path.charAt(0) !== '/' ? '/' + path : path;
  }

  public validateRoutePath(path: string) {
    if (Utils.isNil(path)) {
      throw new UnknownRequestMappingException();
    }

    return this.validatePath(path);
  }

  public scanForPaths(
    metatype: Type<any>,
  ): RoutePathProperties[] {
    const controller = this.injector.get(metatype);
    const paths = MetadataStorage.getRequestMapping(metatype);

    return paths.map(({ methodName, path, requestMethod }) =>
      this.createRoutePathProps(controller, methodName, path, requestMethod),
    );
  }

  private createRoutePathProps(
    controller: Type<any>,
    methodName: string,
    path: string,
    requestMethod: keyof RequestMethod,
  ): RoutePathProperties {
    const targetCallback = controller[methodName];

    return {
      path: this.validateRoutePath(path),
      requestMethod,
      targetCallback,
      methodName,
    };
  }

  public exploreMethodMetadata(
    metatype: Type<any>,
    methodName: string,
  ) {
    const controller = this.injector.get(metatype);

    const {
      path,
      requestMethod,
    } = MetadataStorage.getRequestMapping(metatype, methodName);

    return this.createRoutePathProps(controller, methodName, path, requestMethod);
  }

  public extractRouterPath(
    target: Type<any>,
    prefix?: string,
  ) {
    let { path } = MetadataStorage.getController(target);
    if (prefix) path = prefix + this.validateRoutePath(path);
    return this.validateRoutePath(path);
  }
}