import type { Viewer } from 'cesium';
import type { Snippet } from 'svelte';

// GeoJSON types
export interface Point {
	type: 'Point';
	coordinates: [number, number] | [number, number, number];
}

export interface Feature<G = any> {
	type: 'Feature';
	geometry: G;
	properties: Record<string, any> | null;
}

export interface FeatureCollection<G = any> {
	type: 'FeatureCollection';
	features: Array<Feature<G>>;
}

// GeoJSON Geometry types
export interface LineString {
	type: 'LineString';
	coordinates: Array<[number, number] | [number, number, number]>;
}

// Component Props Types
export interface ViewerProps {
	ionToken?: string;
	children?: Snippet<[Viewer]>;
}

export interface CameraProps {
	longitude?: number;
	latitude?: number;
	height?: number;
	heading?: number;
	pitch?: number;
	roll?: number;
}

export interface TerrainProps {
	assetId?: number;
}

export interface GeoJSONPointProps {
	data?: FeatureCollection<Point> | Feature<Point> | null;
	style?: PointStyle;
	clampToGround?: boolean;
	heightOffset?: number;
}

export interface GeoJSONLineProps {
	data?: FeatureCollection<LineString> | Feature<LineString> | null;
	style?: LineStyle;
	clampToGround?: boolean;
	heightOffset?: number;
}

// Style Types
export interface BaseStyle {
	color?: string;
	opacity?: number;
	outlineColor?: string;
	outlineWidth?: number;
}

export interface PointStyle extends BaseStyle {
	pointSize?: number;
	pointImage?: string;
	imageWidth?: number;
	imageHeight?: number;
	rotation?: number;
	anchorX?: number;
	anchorY?: number;
}

export interface LineStyle extends BaseStyle {
	lineWidth?: number;
	dashPattern?: number[];
}

export interface PolygonStyle extends BaseStyle {
	fillColor?: string;
	fillOpacity?: number;
	pattern?: string;
}
