import { Injectable } from '@nest/core';

import { MetadataStorage } from '../metadata-storage';

export function Controller(path: string = ''): ClassDecorator {
  return (target) => {
    MetadataStorage.controllers.add({
      target: target.constructor,
      path,
    });

    Injectable()(target);
  };
}