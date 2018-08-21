import { Injectable, Type, Injector } from '@nuclei/core';
import { BrowserWindow } from 'electron';

import { MetadataStorage } from '../storage';
import { WindowRef } from './symbols';

// Use one service to manage all window features
@Injectable()
export class WindowsService {

	private readonly windowRefs = new Map<Type<any>, BrowserWindow>();

	constructor(private readonly injector: Injector) {}

	public async add(windows: Type<any>[]) {
		windows.forEach(window => {
			const metadata = MetadataStorage.getWindowByType(window.constructor);
			const browserWindow = new BrowserWindow(metadata);

			this.injector.bind(WindowRef)
				.toConstantValue(browserWindow)
				.whenInjectedInto(<any>window);

			this.windowRefs.set(window, browserWindow);
		});
	}

}
