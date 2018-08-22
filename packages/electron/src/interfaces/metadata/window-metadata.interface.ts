import { Target } from '@one/core';

import { BrowserWindowConstructorOptions } from 'electron';

export interface WindowMetadata
  extends BrowserWindowConstructorOptions,
    Target {}
