import 'reflect-metadata';
import { bootstrap } from '@nuclei/core';
import { app } from 'electron';

import { AppModule } from './app.module';

app.on('ready', async () => {
	await bootstrap(AppModule);
});

