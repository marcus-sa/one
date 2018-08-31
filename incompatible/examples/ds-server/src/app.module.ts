import { APP_INITIALIZER, Module } from '@one/core';
import { DsServerModule } from '@one/ds-server';

import { AppService } from './app.service';

@Module({
  imports: [DsServerModule.forRoot()],
  providers: [
    AppService,
    {
      provide: APP_INITIALIZER,
      useFactory: (app: AppService) => console.log(app),
      deps: [AppService],
      multi: true,
    },
  ],
})
export class AppModule {}
