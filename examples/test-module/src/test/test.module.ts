import {
  Module,
  Provider,
  MODULE_INITIALIZER,
  DynamicModule,
  Type,
} from '@nuclei/core';

import { PROVIDERS } from './symbols';

import { TestService } from './test.service';

@Module()
export class TestModule {
  public static forRoot(providers: Type<any>[]): DynamicModule {
    return {
      module: TestModule,
      exports: providers,
      providers: [
        TestService,
        ...providers,
        {
          provide: MODULE_INITIALIZER,
          useFactory: (test: TestService) => test.bind(providers),
          deps: [TestService],
          multi: true,
        },
      ],
    };
  }
}
