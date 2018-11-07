import { Module, APP_INIT, OnModuleInit } from '@one/core';

import { FirstService } from './first.service';
import { SecondService } from './second.service';

import { THIRD_SERVICE } from './tokens';

// @TODO: Lazy injecting needs to work for all providing methods
@Module({
  providers: [
    FirstService,
    SecondService,
    {
      provide: THIRD_SERVICE,
      useValue: 'test',
    },
    {
      provide: APP_INIT,
      useFactory: (second: SecondService) => console.log(second),
      deps: [SecondService],
      multi: true,
    },
  ],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly first: FirstService) {}

  onModuleInit() {
    console.log(this.first);
  }
}
