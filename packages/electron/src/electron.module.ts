import { Module, DynamicModule } from '@nuclei/core';
import { app } from 'electron';

import { ElectronCoreModule } from './electron-core.module';

@Module()
export class ElectronModule {
  public static forRoot(options = {}): Promise<DynamicModule> {
    return new Promise(resolve => {
      app.once('ready', () => {
        resolve({
          module: ElectronModule,
          imports: [ElectronCoreModule.forRoot(options)],
        });
      });
    });
  }
}
