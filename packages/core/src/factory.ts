import { Container } from 'inversify';

import { APP_INITIALIZER } from './constants';
import { Registry } from './registry';
import { Type } from './interfaces';
import { Module } from './module';

export class Factory {

	private readonly modulesContainer = new Container({
		autoBindInjectable: true,
		defaultScope: 'Singleton',
	});

	private readonly modulesRef = new Container({
		autoBindInjectable: true,
		defaultScope: 'Singleton',
	});

	private readonly registry = new Registry();

	constructor(private readonly module: Type<any>) {}

	public async start() {
		const module = new Module(
			this.modulesContainer,
			this.modulesRef,
			this.registry,
			this.module,
		);

		await module.create();

		// @TODO: Call app initializers now or in Module ?
		await Promise.all(
			this.registry.getAllProviders(APP_INITIALIZER),
		);
	}

}
