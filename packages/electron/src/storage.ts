import { EventMetadata, Type, WindowMetadata } from './interfaces';
import { BrowserWindowContainer } from './browser-window-container';

export class MetadataStorage {

	public static readonly windows = new Set();

	private static findByTarget(
		metadata: Set<any>,
		ctor: Type<any> | Function,
	): any {
		return Array.from(metadata).find(
			value => value.target === ctor,
		);
	}

	public static getWindowByType(target: Type<any> | Function): WindowMetadata {
		return this.findByTarget(MetadataStorage.windows, target);
	}

}