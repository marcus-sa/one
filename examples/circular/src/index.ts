import { bootstrap } from '@one/core';

import { AppModule } from './app.module';

bootstrap(AppModule).catch(err => console.error(err));
