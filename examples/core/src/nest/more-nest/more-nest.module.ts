import { Module } from '@nuclei/core';

import { MoreNestService } from './more-nest.service';

@Module({
  providers: [MoreNestService],
  exports: [MoreNestService],
})
export class MoreNestModule {}
