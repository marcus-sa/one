import { Injectable, Injector } from '@one/core';

import { NestService } from './nest';

@Injectable()
export class AppService {
  constructor(
    // private readonly nest: NestService,
    // @TODO: Fix hierarchy export of modules and providers
    private readonly injector: Injector,
  ) {}

  public start() {
    console.log(this.injector.get<NestService>(NestService));
  }
}
