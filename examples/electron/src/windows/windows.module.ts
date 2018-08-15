import { Module } from '@nuclei/core';
import { ElectronModule } from '@nuclei/electron';

import { MainWindow } from './main.window';

@Module({
	imports: [
		ElectronModule.forFeature([
			MainWindow,
		]),
	],
})
export class WindowsModule {}