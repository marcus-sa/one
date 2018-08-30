import { Type } from './type.interface';

export type TForwardRef = <T>() => Type<any> | symbol | T;

export interface ForwardRef {
  forwardRef: TForwardRef;
}
