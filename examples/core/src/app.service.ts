import { Injectable } from '@nuclei/core';

import { NestService } from './nest';
import { MoreNestService } from './nest/more-nest';

@Injectable()
export class AppService {

	constructor(
		private readonly nest: NestService,
		// @TODO: Fix hierarchy export of modules and providers
		private readonly moreNest: MoreNestService,
	) {}

	public start() {
		console.log(this.nest);
	}

}
