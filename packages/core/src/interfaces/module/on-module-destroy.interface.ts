import { Type } from '../type.interface';
import { OneModule } from '../../module';

export interface OnModuleDestroy extends Type<OneModule> {
  onModuleDestroy(): any;
}
