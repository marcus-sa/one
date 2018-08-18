import { APP_INITIALIZER, Module, DynamicModule } from '@nuclei/core';

import { ElectronService } from './electron.service';

@Module()
export class ElectronCoreModule {

	public static forRoot(): DynamicModule {
		return {
			module: ElectronCoreModule,
			providers: [
				ElectronService,
				{
					provide: APP_INITIALIZER,
					useFactory: (electron: ElectronService) => electron.start(),
					deps: [ElectronService],
					multi: true,
				}
			],
		};
	}

}