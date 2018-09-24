import { Module } from '@nest/core';
import { ServerModule } from '@nest/server';

import { CatsController } from './cats.controller';

@Module({
  imports: [
    ServerModule.forFeature([CatsController]),
  ],
})
export class V1Module {}