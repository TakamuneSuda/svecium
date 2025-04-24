// GeoJSON types
export interface Polygon {
	type: 'Polygon';
	coordinates: Array<Array<[number, number] | [number, number, number]>>;
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

// Component Props types
export interface GeoJSONPolygonProps {
	data: FeatureCollection<Polygon> | Feature<Polygon>;
	fillColor: string;
	fillOpacity: number;
	show?: boolean;
}
