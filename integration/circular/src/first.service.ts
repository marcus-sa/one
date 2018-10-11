import { Injectable, Inject, forwardRef } from '@one/core';

import { SecondService } from './second.service';
import { THIRD_SERVICE } from './tokens';

@Injectable()
export class FirstService {
  @Inject(forwardRef(() => FirstService))
  public readonly second!: SecondService;

  @Inject(THIRD_SERVICE)
  public readonly third!: string;
}
