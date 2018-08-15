import { Injectable } from '@nuclei/core';

import { TestService } from './test.service';

@Injectable()
export class Test2Service {

	constructor(testService: TestService) {
		console.log(testService);
	}

}
