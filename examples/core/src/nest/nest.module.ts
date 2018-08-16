import { APP_INITIALIZER, Module } from '@nuclei/core';

import { MoreNestModule } from './more-nest';
import { NestService } from './nest.service';
import { AppService } from '../app.service';

@Module({
	imports: [MoreNestModule],
	providers: [
		NestService,
		/*{
			provide: APP_INITIALIZER,
			useFactory: (app: AppService) => app.start(),
			deps: [AppService],
			multi: true,
		},*/
	],
	exports: [
		MoreNestModule,
		NestService,
	],
})
export class NestModule {}
