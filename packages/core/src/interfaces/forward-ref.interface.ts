import { Type } from './type.interface';

export interface ForwardRef {
	forwardRef: () => Type<any> | symbol;
}
