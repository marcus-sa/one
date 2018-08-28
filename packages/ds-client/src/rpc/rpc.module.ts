import { APP_INITIALIZER, Module, ModuleWithProviders, Type } from '@one/core';

import { DsRpcService } from './rpc.service';

@Module({
  providers: [DsRpcService],
})
export class DsRpcModule {
  public static forFeature(providers: Type<any>[]): ModuleWithProviders {
    return {
      module: DsRpcModule,
      providers: [
        ...providers,
        {
          provide: APP_INITIALIZER,
          useFactory: (rpc: DsRpcService) => rpc.add(providers),
          deps: [DsRpcService],
          multi: true,
        },
      ],
    };
  }
}
