import { Module } from '@nuclei/core';
import { ElectronWindowsModule } from '@nuclei/electron';

import { MainWindow } from './main.window';

@Module({
	exports: [ElectronWindowsModule],
	imports: [
		ElectronWindowsModule.forFeature([
			MainWindow,
		]),
	],
})
export class WindowsModule {}
