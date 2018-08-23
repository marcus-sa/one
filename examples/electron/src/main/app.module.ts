import { Module } from '@one/core';
import { ElectronModule } from '@one/electron';

import { WindowsModule } from './windows';

@Module({
  imports: [ElectronModule.forRoot(), WindowsModule],
})
export class AppModule {}
