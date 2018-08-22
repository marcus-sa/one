import { APP_INITIALIZER, Module } from '@nuclei/core';

import { NestModule } from './nest';
import { AppService } from './app.service';
import { MoreNestService } from './nest/more-nest';

@Module({
  imports: [NestModule.forRoot()],
  providers: [
    AppService,
    // @TODO: Doesn't resolve in correct order
    {
      provide: APP_INITIALIZER,
      useFactory: (moreNest: MoreNestService) => moreNest.hello(),
      deps: [MoreNestService],
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: (app: AppService) => app.start(),
      deps: [AppService],
      multi: true,
    },
  ],
})
export class AppModule {}
