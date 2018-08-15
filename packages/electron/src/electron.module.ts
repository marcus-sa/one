import { Module, DynamicModule, Type } from '@nuclei/core';

import { WINDOWS, WINDOW_PROVIDERS } from './symbols';
import { ElectronCoreModule } from './electron-core.module';

@Module()
export class ElectronModule {

	public static forRoot(options) {
		return {
			module: ElectronModule,
			imports: [ElectronCoreModule.forRoot(options)],
		};
	}

	public static forFeature(windows: Type<any>[]): DynamicModule {
		return {
			module: ElectronModule,
			providers: [
				...windows,
				{
					provide: WINDOWS,
					useValue: windows,
				},
				{
					provide: WINDOW_PROVIDERS,
					useFactory: (...windows) => windows,
					deps: windows,
				}
			],
		};
	}

}