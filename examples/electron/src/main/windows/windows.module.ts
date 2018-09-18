import { Module } from '@one/core';
import { ElectronWindowsModule } from '@one/electron';

import { MainWindow } from './main.window';

@Module({
  imports: [ElectronWindowsModule.register([MainWindow])],
})
export class WindowsModule {}
