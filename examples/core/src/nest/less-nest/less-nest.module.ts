import { Module } from '@one/core';

import { LessNestService } from './less-nest.service';

@Module({
  providers: [LessNestService],
  exports: [LessNestService],
})
export class LessNestModule {}
