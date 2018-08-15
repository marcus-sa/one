import { Module, ModuleWithProviders } from '@nuclei/core';

import { Test3Service } from './test3.service';

@Module({
	exports: [Test3Service],
})
export class App3Module {

	public static forRoot(): ModuleWithProviders {
		return {
			module: App3Module,
			providers: [Test3Service],
		};
	}

}
