import { APP_INITIALIZER, DynamicModule, Module } from '@nuclei/core';

import { MoreNestModule } from './more-nest';
import { NestService } from './nest.service';

@Module({
	// module: NestModule,
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
export class NestModule {

	// @TODO: Fix dynamic modules
	/*public static async forRoot(): Promise<DynamicModule> {
		return {};
	}*/

}
