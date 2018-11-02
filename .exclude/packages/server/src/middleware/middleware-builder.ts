import { Type, Utils } from '@nest/core';

import { MiddlewareConfigProxy } from './middleware-config-proxy';
import { MiddlewareConfiguration } from '../interfaces';
import { RoutesMapper } from './routes-mapper.service';

export class MiddlewareBuilder {
  private readonly middlewareCollection = new Set<MiddlewareConfiguration>();

  constructor(private readonly routesMapper: RoutesMapper) {}

  public apply(...middleware: Array<Type<any> | Function>) {
    return new MiddlewareConfigProxy(this, Utils.flatten(middleware));
  }

  public build() {}
}
