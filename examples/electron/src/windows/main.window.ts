import { Window, WindowRef, OnReady } from '@nuclei/electron';
import { BrowserWindow } from 'electron';
import { Inject } from '@nuclei/core';

@Window()
export class MainWindow implements OnReady {

	@Inject(WindowRef)
	private readonly windowRef: BrowserWindow;

	onReady() {}

}