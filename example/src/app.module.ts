import { OnInit, Module, APP_INITIALIZER } from '@nuclei/core';

import { Test2Service } from './test2.service';
import { TestService } from './test.service';
import { App2Module } from './app2.module';

@Module({
	imports: [App2Module],
	providers: [
		Test2Service,
		// @TODO: No matching bindings found for serviceIdentifier: TestService when injecting dependency in useFactory
		{
			provide: APP_INITIALIZER,
			useFactory: () => new Promise(resolve => setTimeout(resolve, 1000)),
			multi: true,
		},
		{
			provide: APP_INITIALIZER,
			useFactory: async () => console.log('wtf'),
			multi: true,
		},
	],
})
export class AppModule implements OnInit {

	onInit() {}

}
