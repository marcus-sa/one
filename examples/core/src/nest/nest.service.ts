import { Injectable } from '@nuclei/core';

// import { AppService } from '../app.service';

@Injectable()
export class NestService {

	// constructor(private readonly moreNest: AppService) {}

	public start() {
		console.log(this);
	}

}
