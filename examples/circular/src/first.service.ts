import { Injectable, LazyInject } from '@nuclei/core';

import { SecondService } from './second.service';

@Injectable()
export class FirstService {

	@LazyInject(() => SecondService)
	public readonly second: SecondService;

}