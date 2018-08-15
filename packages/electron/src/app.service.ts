import { Inject, Injectable, Injector } from '@nuclei/core';
import { app, BrowserWindow } from 'electron';

import { WindowRef, WINDOWS, WINDOW_PROVIDERS } from './symbols';
import { MetadataStorage } from './storage';

@Injectable()
export class AppService {

	private readonly windowsRefs = new Injector();

	@Inject(WINDOW_PROVIDERS)
	private readonly windowProviders: any[];

	@Inject(WINDOWS)
	private readonly windows: any[];

	constructor(private readonly injector: Injector) {}

	public async start() {
		console.log('AppService started');
	}

	public createWindows() {
		this.windows.map(async (window) => {
			const metadata = MetadataStorage.getWindowByType(window.constructor);
			const browserWindow = new BrowserWindow(metadata);

			this.injector.bind(WindowRef)
				.toConstantValue(browserWindow)
				.whenInjectedInto(<any>window);

			this.windowsRefs.bind(window)
				.toConstantValue(browserWindow);

			const windowProvider = this.injector.get(window);

			browserWindow.once('ready', () => {

			});
		});
	}

}