import { Module, APP_INITIALIZER, forwardRef } from '@nuclei/core';

import { FirstService } from './first.service';
import { SecondService } from './second.service';

// @TODO: Lazy injecting needs to work for all providing methods
@Module({
	providers: [
		FirstService,
		SecondService,
		{
			provide: APP_INITIALIZER,
			useFactory: (first: FirstService) => console.log(first.second),
			// forwardRef(() => FirstService)
			deps: [FirstService],
			multi: true,
		},
	],
})
export class AppModule {}
