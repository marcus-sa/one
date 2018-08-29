import { AsyncModuleConfig, DynamicModule, Module } from '@one/core';
import * as omit from 'lodash.omit';

import { DEEPSTREAM_PROVIDERS, DEEPSTREAM_EXPORTS } from './providers';
import { DsClientConfig } from './ds-client-config.interface';
import { DEEPSTREAM_CLIENT_CONFIG } from './symbols';

@Module()
export class DsClientModule {
  public static forRootAsync(
    metadata: AsyncModuleConfig<DsClientConfig>,
  ): DynamicModule {
    return {
      module: DsClientModule,
      exports: DEEPSTREAM_EXPORTS,
      imports: metadata.imports,
      providers: [
        {
          provide: DEEPSTREAM_CLIENT_CONFIG,
          ...omit(metadata, 'imports'),
        },
        ...DEEPSTREAM_PROVIDERS,
      ],
    };
  }

  public static forRoot(config: DsClientConfig): DynamicModule {
    return {
      module: DsClientModule,
      // exports: DEEPSTREAM_EXPORTS,
      providers: [
        {
          provide: DEEPSTREAM_CLIENT_CONFIG,
          useValue: config,
        },
        ...DEEPSTREAM_PROVIDERS,
      ],
    };
  }
}
