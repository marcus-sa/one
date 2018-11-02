import { DynamicModule, Module } from '@one/core';

import { MoreOneModule } from './more-nest';
import { LessOneModule } from './less-nest';
import { NestService } from './nest.service';

@Module()
export class OneModule {
  public static forRoot(): Promise<DynamicModule> {
    return new Promise(resolve => {
      setTimeout(() => {
        console.log('OneModule#forRoot');
        resolve({
          module: OneModule,
          imports: [LessOneModule, MoreOneModule],
          providers: [NestService],
          exports: [MoreOneModule, NestService],
        });
      }, 500);
    });
  }
}
