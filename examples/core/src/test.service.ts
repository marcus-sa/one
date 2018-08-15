import { Injectable } from '@nuclei/core';

import { Test3Service } from './test3.service';

@Injectable()
export class TestService {

	constructor(testService: Test3Service) {
		console.log(testService);
	}

}
