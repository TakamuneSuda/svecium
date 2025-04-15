import type { Viewer } from 'cesium';
import { setContext, getContext } from 'svelte';

const MAP_CONTEXT_KEY = Symbol('Cesium map context');

// Base class for context
class CesiumContext<T> {
	protected _viewer: T | null = $state.raw(null);

	get viewer(): T | null {
		return this._viewer;
	}

	set viewer(value: T | null) {
		this._viewer = value;
	}
}

// Map context
export class MapContext extends CesiumContext<Viewer> {}

export function prepareMapContext(): MapContext {
	const mapCtx = new MapContext();
	setContext(MAP_CONTEXT_KEY, mapCtx);
	return mapCtx;
}

export function getMapContext(): MapContext {
	const mapCtx = getContext<MapContext>(MAP_CONTEXT_KEY);
	if (!mapCtx) throw new Error('Map context not found');
	return mapCtx;
}
