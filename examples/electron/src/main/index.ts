import 'reflect-metadata';
import { bootstrap } from '@nuclei/core';

import { AppModule } from './app.module';

bootstrap(AppModule).catch(console.error);
