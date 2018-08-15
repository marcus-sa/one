import { OnInit, Module, APP_INITIALIZER } from '@nuclei/core';

import { Test2Service } from './test2.service';
import { TestService } from './test.service';
import { App2Module } from './app2.module';

@Module({
	imports: [App2Module],
	providers: [
		// @TODO: No matching bindings found for serviceIdentifier: TestService when injecting dependency in useFactory
		/*{
			provide: APP_INITIALIZER,
			useFactory: (test: TestService) => console.log(APP_INITIALIZER, test),
			deps: [TestService],
		},*/
		Test2Service,
	],
})
export class AppModule implements OnInit {

	onInit() {}

}
