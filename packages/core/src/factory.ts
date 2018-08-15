import { Container } from 'inversify';

import { Type } from './interfaces';
import { Module } from './module/';

export class Factory {

	private readonly modulesContainer = new Container({
		autoBindInjectable: true,
		defaultScope: 'Singleton',
	});

	private readonly modulesRef = new Container({
		autoBindInjectable: true,
		defaultScope: 'Singleton',
	});

	constructor(private readonly module: Type<any>) {}

	public async start() {
		const module = new Module(
			this.modulesContainer,
			this.modulesRef,
			this.module,
		);

		await module.create();
	}

}
