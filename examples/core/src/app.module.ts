import { APP_INITIALIZER, Module } from '@nuclei/core';

import { NestModule, NestService } from './nest';
import { AppService } from './app.service';

@Module({
	imports: [NestModule],
	providers: [
		AppService,
		// @TODO: Fix useFactory dependency injection
		{
			provide: APP_INITIALIZER,
			useFactory: (nest: NestService) => nest.start(),
			deps: [NestService],
			multi: true,
		},
	],
})
export class AppModule {}