import { Injectable, Type, Injector } from '@nuclei/core';

import { TEST } from './symbols';

@Injectable()
export class TestService {
  constructor(private readonly injector: Injector) {}

  public bind(providers: Type<any>[]) {
    providers.forEach(provider => {
      this.injector
        .bind(TEST)
        .toConstantValue('lol')
        .whenInjectedInto(provider);
    });
  }
}
