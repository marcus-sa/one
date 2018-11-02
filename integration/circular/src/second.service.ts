import { Injectable, Inject, forwardRef } from '@one/core';

import { FirstService } from './first.service';

@Injectable()
export class SecondService {
  @Inject(forwardRef(() => FirstService))
  private readonly first!: FirstService;
}
