import { Injectable, Reflector } from '@nest/core';

import { PATH_METADATA } from '../tokens';

export function Controller(path: string): ClassDecorator {
  return (target: object) => {
    Reflector.set(PATH_METADATA, path, target);

    Injectable()(target);
  };
}
