import { Type } from '../type.interface';
import { Module } from '../../module';

export interface OnModuleInit extends Type<Module> {
  onModuleInit(): any;
}
