import { injectable } from 'inversify';

import { ModuleMetadata } from '../../interfaces';
import { Registry } from '../../registry';

export function Module(metadata: ModuleMetadata = {}): ClassDecorator {
	return (target: object) => {
		Registry.defineMetadata(target, metadata);

		return injectable()(target);
	};
}
