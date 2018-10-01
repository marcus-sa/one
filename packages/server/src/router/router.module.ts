import { Module } from '@nest/core';

import { RouterResponseController } from './router-response-controller.service';
import { RouterExecutionContext } from './router-execution-context.service';
import { RouterMethodFactory } from './router-method-factory.service';
import { RouteParamsFactory } from './route-params-factory.service';
import { RoutesResolver } from './routes-resolver.service';
import { RouterBuilder } from './router-builder.service';
import { RouterProxy } from './router-proxy.service';

import { HelpersModule } from '../helpers';

@Module({
  exports: [RoutesResolver],
  providers: [
    HelpersModule,
    RouterExecutionContext,
    RouterMethodFactory,
    RouteParamsFactory,
    RouterResponseController,
    RouterBuilder,
    RouterProxy,
    RoutesResolver,
  ],
})
export class RouterModule {}
