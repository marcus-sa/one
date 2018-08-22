import { DynamicModule, Module, MODULE_INITIALIZER, Type } from '@nuclei/core';

import { WindowsService } from './windows.service';

@Module()
export class ElectronWindowsModule {

	public static forFeature(windows: Type<any>[]): DynamicModule {
		return {
			module: ElectronWindowsModule,
			exports: [
				WindowsService,
				...windows,
			],
			providers: [
				WindowsService,
				...windows,
				{
					provide: MODULE_INITIALIZER,
					useFactory: (winService: WindowsService) => winService.add(windows),
					deps: [WindowsService],
					multi: true,
				},
			],
		};
	}

}
