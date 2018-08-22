import { Target } from '@nuclei/core';

import { BrowserWindowConstructorOptions } from 'electron';

export interface WindowMetadata
  extends BrowserWindowConstructorOptions,
    Target {}
