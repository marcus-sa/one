import { DynamicModule, Module } from '@one/core';

import { MoreNestModule } from './more-nest';
import { NestService } from './nest.service';

@Module()
export class NestModule {
  // @TODO: Fix dynamic modules
  public static forRoot(): Promise<DynamicModule> {
    return new Promise(resolve => {
      setTimeout(() => {
        console.log('NestModule#forRoot');
        resolve({
          module: NestModule,
          imports: [MoreNestModule],
          providers: [NestService],
          exports: [MoreNestModule, NestService],
        });
      }, 5000);
    });
  }
}
