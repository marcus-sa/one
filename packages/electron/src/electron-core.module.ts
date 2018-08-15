import { APP_INITIALIZER, Module, DynamicModule } from '@nuclei/core';

import { AppService } from './app.service';

@Module()
export class ElectronCoreModule {

	public static forRoot(): DynamicModule {
		return {
			module: ElectronCoreModule,
			providers: [
				AppService,
				{
					provide: APP_INITIALIZER,
					useFactory: (appService: AppService) => appService.start(),
					deps: [AppService],
					multi: true,
				}
			],
		};
	}

}