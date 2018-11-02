import { APP_INIT, Module, MODULE_INIT } from '@one/core';

import { OneModule } from './nest';
import { AppService } from './app.service';
import { MoreNestService } from './nest/more-nest';

@Module({
  imports: [OneModule.forRoot()],
  providers: [
    AppService,
    {
      provide: APP_INIT,
      useFactory: (app: AppService) => app.start(),
      deps: [AppService],
      multi: true,
    },
    {
      provide: MODULE_INIT,
      useFactory: (moreNest: MoreNestService) => moreNest.hello(),
      deps: [MoreNestService],
      multi: true,
    },
  ],
})
export class AppModule {}
