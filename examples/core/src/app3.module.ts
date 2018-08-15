import { DynamicModule, Module, ModuleWithProviders } from '@nuclei/core';

import { Test3Service } from './test3.service';

@Module({
	exports: [Test3Service],
})
export class App3Module {

// @TODO: Fix module resolution so that imports and exports works in DynamicModule
	public static forRoot(): ModuleWithProviders {
		return {
			module: App3Module,
			// exports: [Test3Service],
			providers: [Test3Service],
		};
	}

}
