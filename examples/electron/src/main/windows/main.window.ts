import { Window, WindowRef } from '@nuclei/electron';
import { BrowserWindow } from 'electron';
import { Inject } from '@nuclei/core';

@Window()
export class MainWindow {

	@Inject(WindowRef)
	public readonly windowRef: BrowserWindow;

}
