import { Provider } from '../provider.interface';
import { Type } from '../type.interface';
import { Module } from '../../module';

export interface ModuleWithProviders {
  module: Type<Module>;
  providers: Provider[];
}
