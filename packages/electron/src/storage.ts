import { Target, Type } from '@nuclei/core';

import { EventMetadata, WindowMetadata } from './interfaces';

export class MetadataStorage {

	public static readonly windows = new Set<WindowMetadata>();
	public static readonly events = new Set<EventMetadata>();

	private static findByTarget<T extends Target>(
		metadata: Set<T>,
		target: Type<any> | Function,
	): T {
		return [...metadata.values()].find(
			value => value.target === target,
		);
	}

	private static filterByTarget<T extends Target>(
		metadata: Set<T>,
		target: Type<any> | Function,
	): T[] {
		return [...metadata.values()].filter(
			value => value.target === target,
		);
	}

	public static getWindowByType(target: Type<any> | Function) {
		return this.findByTarget<WindowMetadata>(this.windows, target);
	}

	public static getEventsByType(target: Type<any> | Function) {
		return this.filterByTarget<EventMetadata>(this.events, target);
	}

}
