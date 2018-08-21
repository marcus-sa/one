import { Module } from '@nuclei/core';
import { ElectronWindowsModule } from '@nuclei/electron';

import { MainWindow } from './main.window';

@Module({
	imports: [
		ElectronWindowsModule.forFeature([
			MainWindow,
		]),
	],
})
export class WindowsModule {}