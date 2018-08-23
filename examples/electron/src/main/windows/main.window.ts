import { Window, WindowRef, Event } from '@one/electron';
import { BrowserWindow } from 'electron';
import { Inject } from '@one/core';

@Window()
export class MainWindow {
  @Inject(WindowRef)
  public readonly windowRef: BrowserWindow;

  @Event('closed')
  public onClosed() {
    console.log(this.windowRef, 'MainWindow has been closed');
  }
}
