import { Module } from '@nest/core';

import { InterceptorsModule } from '../interceptors';
import { GuardsModule } from '../guards';
import { PipesModule } from '../pipes';

import { ExternalContextCreator } from './external-context-creator.service';
import { ContextUtils } from './context-utils.service';

@Module({
  imports: [
    InterceptorsModule,
    GuardsModule,
    PipesModule,
  ],
  providers: [
    ExternalContextCreator,
    ContextUtils,
  ],
  exports: [
    InterceptorsModule,
    GuardsModule,
    PipesModule,
    ExternalContextCreator,
    ContextUtils,
  ],
})
export class HelpersModule {}