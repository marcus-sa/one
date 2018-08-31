import { Type } from './type.interface';

export type TForwardRef = <T>() => Type<any> | T;

export interface ForwardRef {
  forwardRef: TForwardRef;
}
