import { Module } from '@nest/core';

import { RouterResponseController } from './router-response-controller.service';
import { RoutesResolver } from './routes-resolver.service';
import { RouterBuilder } from './router-builder.service';
import { RouterProxy } from './router-proxy.service';

@Module({
  exports: [RoutesResolver],
  providers: [
    RouterResponseController,
    RouterBuilder,
    RouterProxy,
    RoutesResolver,
  ],
})
export class RouterModule {}