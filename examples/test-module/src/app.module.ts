import { Module, APP_INITIALIZER } from '@nuclei/core';

import { TestModule } from './test';
import { FirstService } from './first.service';

@Module({
	imports: [
		TestModule.forRoot([
			FirstService,
		]),
	],
	providers: [
		{
			provide: APP_INITIALIZER,
			useFactory: (first: FirstService) => console.log(first.test),
			deps: [FirstService],
			multi: true,
		},
	],
})
export class AppModule {}
