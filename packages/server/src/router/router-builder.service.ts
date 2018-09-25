import { Injectable, Injector, Type } from '@nest/core';

import { MetadataStorage } from '../metadata-storage';
import { RouterMethodFactory } from '../helpers';

@Injectable()
export class RouterBuilder {
  private readonly routerMethodFactory = new RouterMethodFactory();

  constructor(private readonly injector: Injector) {}

  private validatePath(path: string) {
    return path.charAt(0) !== '/' ? '/' + path : path;
  }

  public validateRoutePath(path: string) {
    if (!path) throw new Error('test');

    return this.validatePath(path);
  }

  public getRequestMappings(
    controller: Type<any>,
  ) {
    const metadata = MetadataStorage.getRequestMapping(controller);
  }

  public exploreMethodMetadata(
    controller: Type<any>,
    methodName: string,
  ) {
    const instance = this.injector.get(controller);
    const targetCallback = instance[methodName];

    const {
      path,
      requestMethod,
    } = MetadataStorage.getRequestMapping(controller, methodName);

    return {
      path: this.validateRoutePath(path),
      requestMethod,
      targetCallback,
      methodName,
    };
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