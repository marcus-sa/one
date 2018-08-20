import {
	Module,
	Provider,
	MODULE_INITIALIZER,
	DynamicModule
} from '@nuclei/core';

import { PROVIDERS } from './symbols';

import { TestService } from './test.service';

@Module()
export class TestModule {

	public static forRoot(providers: Provider[] = []): DynamicModule {
		return {
			module: TestModule,
			exports: providers,
			providers: [
				TestService,
				...providers,
				{
					provide: PROVIDERS,
					useValue: providers,
				},
				{
					provide: MODULE_INITIALIZER,
					useFactory: (test: TestService) => test.bind(),
					deps: [TestService],
					multi: true,
				},
			],
		};
	}

}
