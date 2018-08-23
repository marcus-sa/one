import { Module } from '@one/core';
import { ElectronWindowsModule } from '@one/electron';

import { MainWindow } from './main.window';

@Module({
  exports: [ElectronWindowsModule],
  imports: [ElectronWindowsModule.register([MainWindow])],
})
export class WindowsModule {}
