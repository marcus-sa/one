import { Module } from '@nest/core';
import { ServerModule } from '@nest/server';

import { CatsModule, CatsController } from './cats';

@Module({
  imports: [
    CatsModule,
    ServerModule.forFeature([
      CatsController,
    ], {
      prefix: 'v2',
    }),
  ],
})
export class V2Module {}