import { interfaces } from 'inversify';

import { TargetRef } from './target-ref.interface';
import { ForwardRef } from './forward-ref.interface';
import { Type } from './type.interface';

export type TLazyInject = (
  serviceIdentifier:
    | string
    | symbol
    | interfaces.Newable<any>
    | interfaces.Abstract<any>,
) => (proto: any, key: string) => void;

export interface ILazyInject extends TargetRef {
  forwardRef: ForwardRef;
  lazyInject: (lazyInject: TLazyInject, provider: Type<any> | symbol) => any;
}
