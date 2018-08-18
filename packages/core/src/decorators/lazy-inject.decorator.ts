// import { Container } from 'inversify';
import { Type } from '../interfaces';

import { Registry } from  '../registry';

export function LazyInject(provider: () => Type<any> | symbol): PropertyDecorator {
	return (target: object, property: string) => {
		Registry.lazyInjects.add({
			target: target.constructor,
			property,
			// provider,
			forwardRef: (lazyInject: any) => lazyInject(provider())(target, property),
		});
	};
}