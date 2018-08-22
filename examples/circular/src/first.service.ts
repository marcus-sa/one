import { Injectable, Inject, forwardRef } from '@one/core';

import { SecondService } from './second.service';

@Injectable()
export class FirstService {
  @Inject(forwardRef(() => FirstService))
  public readonly second: SecondService;
}
