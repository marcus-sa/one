import { Window, WindowRef } from '@one/electron';
import { BrowserWindow } from 'electron';
import { Inject } from '@one/core';

@Window()
export class MainWindow {
  @Inject(WindowRef)
  public readonly windowRef: BrowserWindow;
}
