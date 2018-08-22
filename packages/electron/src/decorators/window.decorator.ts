import { BrowserWindowConstructorOptions } from 'electron';
import { Injectable } from '@nuclei/core';

import { MetadataStorage } from '../storage';

export function Window(
  options: BrowserWindowConstructorOptions = {},
): ClassDecorator {
  return (target: object) => {
    MetadataStorage.windows.add({
      target: target.constructor,
      ...options,
    });

    return Injectable()(target);
  };
}
