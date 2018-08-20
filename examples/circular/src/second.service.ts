import { Injectable, Inject, forwardRef } from '@nuclei/core';

import { FirstService } from './first.service';

@Injectable()
export class SecondService {

	@Inject(forwardRef(() => FirstService))
	private readonly first: FirstService;

}
