import { DynamicModule, Module } from '@nuclei/core';

import { MoreNestModule } from './more-nest';
import { NestService } from './nest.service';

@Module()
export class NestModule {
  // @TODO: Fix dynamic modules
  public static forRoot(): Promise<DynamicModule> {
    console.log('NestModule#forRoot');
    return new Promise(resolve => {
      setTimeout(() => {
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
