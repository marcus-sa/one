import { Module, APP_INITIALIZER } from '@one/core';
import { ConfigModule, ConfigService } from '@one/config';
import { CollectionModule, IpfsModule } from '@one/ipfs';
import * as path from 'path';

import { UserCollection } from './user.collection';
import { TestService } from './test.service';

// @TODO: Gets created in wrong order
@Module({
  imports: [
    ConfigModule.load(path.join(__dirname, '../config/*')),
    IpfsModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => config.get('ipfs'),
      deps: [ConfigService],
    }),
    CollectionModule.forFeature([UserCollection]),
  ],
  providers: [
    TestService,
    {
      provide: APP_INITIALIZER,
      useFactory: (test: TestService) => test.start(),
      deps: [TestService],
      multi: true,
    }
  ],
})
export class AppModule {}