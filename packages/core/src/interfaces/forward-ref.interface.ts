import { Type } from './type.interface';
import { Provider } from './provider.interface';

export type TForwardRef = <T>() => Type<Provider> | T | symbol;

export interface ForwardRef {
  forwardRef: TForwardRef;
}
