import { Module } from '@nuclei/core';

import { TestService } from './test.service';
import { App3Module } from './app3.module';

@Module({
	imports: [App3Module.forRoot()],
	exports: [TestService],
	providers: [TestService],
})
export class App2Module {}
