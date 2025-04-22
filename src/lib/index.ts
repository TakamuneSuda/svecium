// Components
export { default as Viewer } from './components/Viewer.svelte';
export { default as Imagery } from './components/Imagery.svelte';
export { default as Terrain } from './components/Terrain.svelte';
export { default as Camera } from './components/Camera.svelte';
export { default as GeoJSONPoint } from './components/GeoJSONPoint.svelte';
export { default as GeoJSONLine } from './components/GeoJSONLine.svelte';
export { default as GeoJSONPolygon } from './components/GeoJSONPolygon.svelte';
export { default as Mvt } from './components/Mvt.svelte';
export type { GeoJSONPointProps } from './components/GeoJSONPoint';

// Context
export { type MapContext } from './contexts.svelte.js';
export { prepareMapContext, getMapContext } from './contexts.svelte.js';

// Types
export type {
	PointStyle,
	LineStyle,
	PolygonStyle,
	CameraPosition,
	CameraOrientation
} from '$lib/types';
