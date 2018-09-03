import { Type } from '../type.interface';
import { Module } from '../../module';

export interface OnModuleDestroy extends Type<Module> {
  onModuleDestroy(): any;
}
