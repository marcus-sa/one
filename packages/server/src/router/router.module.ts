import { Module } from '@nest/core';

import { RouterResponseController } from './router-response-controller.service';
import { RoutesResolver } from './routes-resolver.service';

@Module({
  exports: [RoutesResolver],
  providers: [
    RouterResponseController,
    RoutesResolver,
  ],
})
export class RouterModule {}