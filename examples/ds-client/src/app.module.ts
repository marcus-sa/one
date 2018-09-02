import { APP_INITIALIZER, Module } from '@one/core';
import { DsClientModule, DsRpcModule } from '@one/ds-client';

import { AppService } from './app.service';
import { UserRpcService } from './user-rpc.service';

@Module({
  imports: [
    DsClientModule.forRoot(<string>process.env.DS, {
      username: process.env.USERNAME,
      password: process.env.PASSWORD,
    }),
    DsRpcModule.forFeature([UserRpcService]),
  ],
  providers: [AppService],
})
export class AppModule {}
