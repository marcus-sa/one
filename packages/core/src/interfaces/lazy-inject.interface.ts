import { Target } from './target.interface';
// import { Type } from './type.interface';

export interface ILazyInject extends Target {
	property: string;
	forwardRef: (...args: any[]) => any; // () => Type<any> | symbol;
}