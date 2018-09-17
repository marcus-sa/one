import { Module, APP_INITIALIZER } from '@one/core';

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
      provide: APP_INITIALIZER,
      useFactory: (first: FirstService) => console.log(first),
      // forwardRef(() => FirstService)
      deps: [FirstService],
      multi: true,
    },
  ],
})
export class AppModule {}
