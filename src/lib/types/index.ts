import type { Viewer } from 'cesium';
import type { Snippet } from 'svelte';

// GeoJSON Geometry types
export interface Point {
	type: 'Point';
	coordinates: [number, number] | [number, number, number];
}

export interface LineString {
	type: 'LineString';
	coordinates: Array<[number, number] | [number, number, number]>;
}

export interface Polygon {
	type: 'Polygon';
	coordinates: Array<Array<[number, number] | [number, number, number]>>;
}

// GeoJSON Feature types
export interface Feature<G = any> {
	type: 'Feature';
	geometry: G;
	properties: Record<string, any> | null;
}

export interface FeatureCollection<G = any> {
	type: 'FeatureCollection';
	features: Array<Feature<G>>;
}
export interface LineString {
	type: 'LineString';
	coordinates: Array<[number, number] | [number, number, number]>;
}

// Component Props Types
export interface ViewerProps {
	ionToken?: string;
	children?: Snippet<[Viewer]>;
}

export interface CameraPosition {
	longitude?: number;
	latitude?: number;
	height?: number;
}

export interface CameraOrientation {
	heading?: number;
	pitch?: number;
	roll?: number;
}

export type CameraProps = {
	// 個別のプロパティ指定
	longitude?: number;
	latitude?: number;
	height?: number;
	heading?: number;
	pitch?: number;
	roll?: number;
	// オブジェクトでの指定
	cameraPosition?: CameraPosition;
	cameraOrientation?: CameraOrientation;
};

export type TerrainProps = number;

export interface GeoJSONPointProps {
	data?: FeatureCollection<Point> | Feature<Point> | null;
	style?: PointStyle;
	clampToGround?: boolean;
	heightOffset?: number;
	show?: boolean;
}

export interface GeoJSONLineProps {
	data: FeatureCollection<LineString> | Feature<LineString>;
	color?: string;
	opacity?: number;
	lineWidth?: number;
	clampToGround?: boolean;
	heightOffset?: number;
	show?: boolean;
}

export interface GeoJSONPolygonProps {
	data: FeatureCollection<Polygon> | Feature<Polygon>;
	fillColor: string;
	fillOpacity: number;
	show?: boolean;
}

// Style Types
export interface PolygonStyle {
	// 塗りつぶしの色
	fillColor: string;
	// 透明度（0-1）
	fillOpacity?: number;
}

export interface PointStyle {
	// 点の色
	color?: string;
	// 点のサイズ
	pointSize?: number;
	// 画像を使用する場合
	pointImage?: string;
	imageWidth?: number;
	imageHeight?: number;
	rotation?: number;
	anchorX?: number;
	anchorY?: number;
	// アウトラインの色
	outlineColor?: string;
	// アウトラインの幅
	outlineWidth?: number;
	// 全体の透明度（0-1）
	opacity?: number;
}

export interface LineStyle {
	// 線の色
	color?: string;
	// 線の幅
	lineWidth?: number;
	// 破線パターン
	dashPattern?: number[];
	// アウトラインの色
	outlineColor?: string;
	// アウトラインの幅
	outlineWidth?: number;
	// 全体の透明度（0-1）
	opacity?: number;
}
