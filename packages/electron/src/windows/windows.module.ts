import { Module } from '@nuclei/core';

import { WindowsService } from './windows.service';

@Module({
	exports: [WindowsService],
	providers: [WindowsService],
})
export class WindowsModule {}
