import { Injectable, Inject, Type, Injector } from '@nuclei/core';

import { PROVIDERS, TEST } from './symbols';

@Injectable()
export class TestService {

	@Inject(PROVIDERS)
	private readonly providers: Type<any>[];

	constructor(private readonly injector: Injector) {}

	public bind() {
		this.providers.forEach(provider => {
			this.injector.bind(TEST)
				.toConstantValue('lol')
				.whenInjectedInto(provider);
		});
	}

}
