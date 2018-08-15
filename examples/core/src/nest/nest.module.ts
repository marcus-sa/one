import { Module } from '@nuclei/core';

import { MoreNestModule } from './more-nest';
import { NestService } from './nest.service';

@Module({
	imports: [MoreNestModule],
	providers: [NestService],
	exports: [
		MoreNestModule,
		NestService,
	],
})
export class NestModule {}
