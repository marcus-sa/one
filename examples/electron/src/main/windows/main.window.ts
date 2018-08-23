import { Window, WindowRef, Event, Once } from '@one/electron';
import { BrowserWindow } from 'electron';
import { Inject } from '@one/core';

@Window()
export class MainWindow {
  @Inject(WindowRef)
  public readonly windowRef: BrowserWindow;

  @Once()
  @Event('maximize')
  public onReady() {
    console.log('MainWindow is ready');
  }
}
