import { Module, APP_INITIALIZER } from '@nuclei/core';
import { ElectronModule } from '@nuclei/electron';

import { WindowsModule, MainWindow } from './windows';

@Module({
	imports: [
		ElectronModule.forRoot(),
		WindowsModule,
	],
	providers: [
		{
			provide: APP_INITIALIZER,
			useFactory: (main: MainWindow) => console.log(main.windowRef),
			deps: [MainWindow],
			multi: true,
		}
	],
})
export class AppModule {}
