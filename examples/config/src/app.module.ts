import { Module } from '@one/core';
import { DsClientConfig, DsClientModule } from '@one/ds-client';
import { ConfigModule, ConfigService } from '@one/config';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule.load(path.join(__dirname, '../config/*')),
    DsClientModule.forRootAsync({
      // imports: [ConfigModule],
      deps: [ConfigService],
      useFactory: (config: ConfigService) =>
        config.get<DsClientConfig>('deepstream.client'),
    }),
  ],
})
export class AppModule {}
