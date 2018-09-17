import { Type } from './type.interface';
import { InjectionToken } from '../module';

export type Token = Type<any> | InjectionToken<any> | symbol;
