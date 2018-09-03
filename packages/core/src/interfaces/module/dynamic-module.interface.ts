import { ModuleMetadata } from './module-metadata.interface';
import { Type } from '../type.interface';
import { Module } from '../../module';

export interface DynamicModule extends ModuleMetadata {
  module: Type<Module>;
}
