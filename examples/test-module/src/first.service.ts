import { Injectable, Inject, Injector } from '@one/core';

import { TEST } from './test';

@Injectable()
export class FirstService {
  @Inject(TEST)
  public readonly test: string;

  constructor(public readonly injector: Injector) {}
}
