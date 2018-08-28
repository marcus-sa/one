import { TargetRef } from '@one/core';

import { BrowserWindowConstructorOptions } from 'electron';

export interface WindowMetadata
  extends BrowserWindowConstructorOptions,
    TargetRef {}
