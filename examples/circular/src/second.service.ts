import { Injectable, LazyInject } from '@nuclei/core';

import { FirstService } from './first.service';

@Injectable()
export class SecondService {

	@LazyInject(() => FirstService)
	private readonly first: FirstService;

}