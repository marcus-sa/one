import { Module } from '@nuclei/core';
import { ElectronModule } from '@nuclei/electron';

import { WindowsModule } from './windows';

@Module({
	imports: [
		ElectronModule.forRoot(),
		WindowsModule,
	],
})
export class AppModule {}