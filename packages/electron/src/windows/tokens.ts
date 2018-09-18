import { InjectionToken, Type } from '@one/core';
import { BrowserWindow } from 'electron';

export const WINDOWS = new InjectionToken<Type<any>[]>('WINDOWS');
export const WindowRef = new InjectionToken<BrowserWindow>(
  'BROWSER_WINDOW_REF',
);
