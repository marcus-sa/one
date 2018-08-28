import { DynamicModule, Module, MODULE_INITIALIZER } from '@one/core';
import deepstream from 'deepstream.io-client-js';

import { DsClientService } from './ds-client.service';
import { DEEPSTREAM_CLIENT } from './symbols';

@Module()
export class DsClientModule {
  public static forRoot(url: string, authParams?: any): DynamicModule {
    return {
      module: DsClientModule,
      exports: [DEEPSTREAM_CLIENT, DsClientService],
      providers: [
        {
          provide: DEEPSTREAM_CLIENT,
          useValue: deepstream(url),
        },
        DsClientService,
        authParams && {
          provide: MODULE_INITIALIZER,
          useFactory: (dsClient: DsClientService) => dsClient.login(authParams),
          deps: [DsClientService],
          multi: true,
        },
      ],
    };
  }
}
