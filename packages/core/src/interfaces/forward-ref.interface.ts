import { Type } from './type.interface';

export type TForwardRef = () => Type<any> | symbol;

export interface ForwardRef {
	forwardRef: TForwardRef;
}
