import { Injectable } from '@nest/core';

import { InterceptorsConsumer, InterceptorsContextCreator } from '../interceptors';
import { GuardsConsumer, GuardsContextCreator } from '../guards';
import { PipesConsumer, PipesContextCreator } from '../pipes';

import { ContextUtils } from './context-utils.service';

export interface ParamsMetadata {
  [prop: number]: {
    index: number;
    data?: ParamData;
  };
}

@Injectable()
export class ExternalContextCreator {

  constructor(
    private readonly guardsContextCreator: GuardsContextCreator,
    private readonly guardsConsumer: GuardsConsumer,
    private readonly interceptorsContextCreator: InterceptorsContextCreator,
    private readonly interceptorsConsumer: InterceptorsConsumer,
    private readonly pipesContextCreator: PipesContextCreator,
    private readonly pipesConsumer: PipesConsumer,
    private readonly contextUtils: ContextUtils,
  ) {}

  /*static fromContainer(container: NestContainer) {
    return new ExternalContextCreator(

    );
  }*/

  public create<T>(
    controller:
  )

}