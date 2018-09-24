import { Type } from '@nest/core';

import { MetadataStorage } from '../metadata-storage';
import { RouterMethodFactory } from '../helpers';

export class RouterBuilder {
  private readonly routerMethodFactory = new RouterMethodFactory();

  private validatePath(path: string) {
    return path.charAt(0) !== '/' ? '/' + path : path;
  }

  public validateRoutePath(path: string) {
    if (!path) throw new Error('test');

    return this.validatePath(path);
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