import { DynamicModule, Module, MODULE_INITIALIZER, Type } from '@nuclei/core';

import { WindowsService } from './windows.service';
import { WindowsModule } from './windows.module';

@Module()
export class ElectronWindowsModule {

	public static forFeature(windows: Type<any>[]): DynamicModule {
		return {
			module: ElectronWindowsModule,
			imports: [WindowsModule],
			exports: windows,
			providers: [
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
