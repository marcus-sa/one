import { Injectable, Inject } from '@nuclei/core';

import { TEST } from './test';

@Injectable()
export class FirstService {

	@Inject(TEST)
	public readonly test: string;

}
