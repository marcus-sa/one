import {
  DynamicModule,
  Module,
  MODULE_INITIALIZER,
  APP_INITIALIZER,
  Type,
} from '@nest/core';

import { WindowsService } from './windows.service';

@Module()
export class ElectronWindowsModule {
  public static register(windows: Type<any>[]): DynamicModule {
    return {
      module: ElectronWindowsModule,
      exports: [WindowsService, ...windows],
      providers: [
        WindowsService,
        ...windows,
        {
          provide: MODULE_INITIALIZER,
          useFactory: (winService: WindowsService) => winService.add(windows),
          deps: [WindowsService],
          multi: true,
        },
        {
          provide: APP_INITIALIZER,
          useFactory: (winService: WindowsService) => winService.start(),
          deps: [WindowsService],
          multi: true,
        },
      ],
    };
  }
}
