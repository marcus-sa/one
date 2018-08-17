import { Container } from 'inversify';

import { APP_INITIALIZER, ModuleRefs } from './constants';
import { Registry } from './registry';
import { Type } from './interfaces';
import { Module } from './module';

export class Factory {

	private readonly modulesContainer = new Container({
		autoBindInjectable: true,
		defaultScope: 'Singleton',
	});

	private readonly moduleRefs = new Container({
		autoBindInjectable: true,
		defaultScope: 'Singleton',
	});

	private readonly registry = new Registry();

	constructor(private readonly module: Type<any>) {}

	public async start() {
		const module = new Module(
			this.modulesContainer,
			this.moduleRefs,
			this.registry,
			this.module,
		);

		await module.create();

		// @TODO: Call app initializers now or in Module ?
		console.log('Before: APP_INITIALIZER');
		await Promise.all(
			this.registry.getAllProviders(APP_INITIALIZER),
		);
		console.log('After: APP_INITIALIZER');
	}

}
