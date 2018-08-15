import { Module } from '@nuclei/core';

import { TestService } from './test.service';

@Module({
	providers: [TestService],
	exports: [TestService],
})
export class App2Module {}
