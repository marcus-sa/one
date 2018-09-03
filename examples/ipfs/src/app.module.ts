import { APP_INITIALIZER, Module } from '@one/core';
// import { ConfigModule, ConfigService } from '@one/config';
import { CollectionModule, IpfsModule } from '@one/ipfs';
import * as path from 'path';

import { UserCollection } from './user.collection';
import { TestService } from './test.service';

console.log(TestService);

@Module({
  imports: [
    // ConfigModule.load(path.join(__dirname, '../config/*')),
    /*IpfsModule.forRoot({
      pass: '1234'
    }),*/
    CollectionModule.forFeature([UserCollection]),
  ],
  providers: [
    /*
    TestService,
    {
      provide: APP_INITIALIZER,
      useFactory: (test: TestService) => test.start(),
      deps: [TestService],
      multi: true,
    },*/
  ],
})
export class AppModule {}
