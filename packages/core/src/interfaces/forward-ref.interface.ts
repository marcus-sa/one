import { Type } from './type.interface';
import { InjectionToken } from '../module';

export type TForwardRef = () => Type<any> | InjectionToken<any>;

export interface ForwardRef {
  forwardRef: TForwardRef;
}
