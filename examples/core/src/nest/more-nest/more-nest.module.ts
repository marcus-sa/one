import { Module } from '@one/core';

import { MoreNestService } from './more-nest.service';

@Module({
  providers: [MoreNestService],
  exports: [MoreNestService],
})
export class MoreOneModule {}
