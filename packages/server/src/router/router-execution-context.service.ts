import { Injectable, Utils } from '@nest/core';

import { InterceptorsConsumer, InterceptorsContextCreator } from '../interceptors';
import { PipesConsumer, PipesContextCreator } from '../pipes';
import { GuardsConsumer, GuardsContextCreator } from '../guards';
import { ContextUtils } from '../helpers';

import { RouterResponseController } from './router-response-controller.service';
import { RouteParamsFactory } from './route-params-factory.service';

@Injectable()
export class RouterExecutionContext {
  constructor(
    private readonly paramsFactory: RouteParamsFactory,
    private readonly pipesContextCreator: PipesContextCreator,
    private readonly pipesConsumer: PipesConsumer,
    private readonly guardsContextCreator: GuardsContextCreator,
    private readonly guardsConsumer: GuardsConsumer,
    private readonly interceptorsContextCreator: InterceptorsContextCreator,
    private readonly interceptorsConsumer: InterceptorsConsumer,
    private readonly responseController: RouterResponseController,
    private readonly contextUtils: ContextUtils,
  ) {}

  public getCustomFactory(
    factory: (...args: any[]) => void,
    data: any,
  ): (...args: any[]) => any {
    return !Utils.isUndefined(factory) && Utils.isFunction(factory)
      ? (req, res, next) => factory(data, req)
      : () => null;
  }
}