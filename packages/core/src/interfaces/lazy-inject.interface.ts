import { interfaces } from 'inversify';

import { Target } from './target.interface';
import { ForwardRef } from './forward-ref.interface';
import { Type } from './type.interface';

export type TLazyInject = (
  serviceIdentifier:
    | string
    | symbol
    | interfaces.Newable<any>
    | interfaces.Abstract<any>,
) => (proto: any, key: string) => void;

export interface ILazyInject extends Target {
  forwardRef: ForwardRef;
  lazyInject: (lazyInject: TLazyInject, provider: Type<any> | symbol) => any;
}
