import { Type } from '../type.interface';
import { OneModule } from '../../module';

export interface OnModuleInit extends Type<OneModule> {
  onModuleInit(): any;
}
