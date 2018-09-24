import { BaseMetadataStorage, Provider, Type } from '@nest/core';

import {
  ControllerMetadata,
  HeaderMetadata,
  HttpCodeMetadata,
  RequestMappingMetadata,
} from './interfaces';

export type Target = Type<Provider> | Function;

export class MetadataStorage extends BaseMetadataStorage {
  static readonly requestMapping = new Set<RequestMappingMetadata>();
  static readonly controllers = new Set<ControllerMetadata>();
  static readonly httpCodes = new Set<HttpCodeMetadata>();
  static readonly headers = new Set<HeaderMetadata>();

  static getHeaders(target: Target, propertyKey?: string | symbol) {
    return this.filterByTargetProperty(this.headers, target, propertyKey);
  }

  static getHttpCodes(target: Target, propertyKey?: string | symbol) {
    return this.filterByTargetProperty(this.httpCodes, target, propertyKey);
  }

  static getRequestMapping(target: Target, propertyKey?: string | symbol) {
    return this.filterByTargetProperty(this.requestMapping, target, propertyKey);
  }

  static getController(target: Target) {
    return this.findByTarget(this.controllers, target);
  }
}