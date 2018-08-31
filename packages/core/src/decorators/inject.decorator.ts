import { inject } from 'inversify';

import { ForwardRef, Token, TLazyInject } from '../interfaces';
import { Registry } from '../registry';

function createLazyInjection(target: object, property: string) {
  return (lazyInject: TLazyInject, provider: Token) =>
    lazyInject(provider)(target, property);
}

export function Inject(provider: Token | ForwardRef): PropertyDecorator {
  return (target, property) => {
    if (!Registry.hasForwardRef(provider)) {
      return inject(<Token>provider)(target, <string>property);
    }

    Registry.lazyInjects.add({
      target: target.constructor,
      forwardRef: <ForwardRef>provider,
      lazyInject: createLazyInjection(target, <string>property),
    });
  };
}
