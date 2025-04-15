<script lang="ts">
	import { GeoJsonDataSource, Color } from 'cesium';
	import { getMapContext } from '$lib/contexts.svelte';
	import type { PolygonStyle } from '$lib/types';

	// GeoJSON types
	interface Polygon {
		type: 'Polygon';
		coordinates: Array<Array<[number, number] | [number, number, number]>>;
	}

	interface Feature<G = any> {
		type: 'Feature';
		geometry: G;
		properties: Record<string, any> | null;
	}

	interface FeatureCollection<G = any> {
		type: 'FeatureCollection';
		features: Array<Feature<G>>;
	}

	// Props
	let {
		data = $bindable<FeatureCollection<Polygon> | Feature<Polygon> | null>(null),
		style = $bindable<PolygonStyle>({
			color: '#ff0000',
			opacity: 0.5,
			outlineColor: '#ffffff',
			outlineWidth: 2,
			fillColor: '#ff0000',
			fillOpacity: 0.5
		})
	} = $props();

	// Get map context
	const { viewer } = getMapContext();

	// Create data source
	const dataSource = new GeoJsonDataSource('polygon-layer');

	// Load and style polygons
	$effect(() => {
		if (!viewer || !data) return;

		// Filter out non-polygon features
		const polygonFeatures = {
			type: 'FeatureCollection',
			features:
				'features' in data
					? data.features.filter((f: Feature<Polygon>) => f.geometry?.type === 'Polygon')
					: 'geometry' in data && data.geometry?.type === 'Polygon'
						? [data]
						: []
		};

		// Load GeoJSON data
		dataSource
			.load(polygonFeatures, {
				fill: Color.fromCssColorString(style.fillColor || style.color || '#ff0000').withAlpha(
					style.fillOpacity || style.opacity || 0.5
				),
				stroke: Color.fromCssColorString(style.outlineColor || style.color || '#ffffff'),
				strokeWidth: style.outlineWidth || 2,
				clampToGround: true
			})
			.then(() => {
				viewer.dataSources.add(dataSource);
			})
			.catch((error) => {
				console.error('Failed to load GeoJSON polygon data:', error);
			});

		// Cleanup on unmount or data change
		return () => {
			if (viewer && !viewer.isDestroyed()) {
				viewer.dataSources.remove(dataSource);
			}
		};
	});
</script>
