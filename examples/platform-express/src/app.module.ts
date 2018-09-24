import { Module } from '@nest/core';
import { ServerModule } from '@nest/server';
import { ExpressAdapter } from '@nest/platform-express';

import { V1Module } from './v1';
import { V2Module } from './v2';

@Module({
  imports: [
    ServerModule.forRoot(ExpressAdapter, {
      port: 3030,
    }),
    V1Module,
    V2Module,
  ],
})
export class AppModule {}