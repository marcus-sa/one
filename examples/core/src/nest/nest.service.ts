import { Injectable } from '@nuclei/core';

import { MoreNestService } from './more-nest';

@Injectable()
export class NestService {

	constructor(private readonly moreNest: MoreNestService) {}

	public start() {
		console.log(this);
	}

}
