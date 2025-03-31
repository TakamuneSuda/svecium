<script lang="ts">
	import { GeoJsonDataSource, Color } from 'cesium';
	import { getMapContext } from '$lib/contexts.svelte';

	// GeoJSON types
	interface Point {
		type: 'Point';
		coordinates: [number, number] | [number, number, number];
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
		data = $bindable<FeatureCollection<Point> | Feature<Point> | null>(null),
		color = Color.ROYALBLUE,
		size = 10,
		outline = true,
		outlineColor = Color.BLACK,
		outlineWidth = 2,
		autoZoom = true
	} = $props();

	// Get map context
	const { viewer } = getMapContext();

	// Create data source
	const dataSource = new GeoJsonDataSource('point-layer');

	// Load and style points
	$effect(() => {
		if (!viewer || !data) return;

		// Filter out non-point features
		const pointFeatures = {
			type: 'FeatureCollection',
			features:
				'features' in data
					? data.features.filter((f: Feature<Point>) => f.geometry.type === 'Point')
					: data.geometry.type === 'Point'
						? [data]
						: []
		};

		// Load GeoJSON data
		dataSource
			.load(pointFeatures, {
				markerColor: color,
				markerSize: size,
				stroke: outline ? outlineColor : undefined,
				strokeWidth: outline ? outlineWidth : 0
			})
			.then(() => {
				viewer.dataSources.add(dataSource);
				if (autoZoom) {
					viewer.zoomTo(dataSource);
				}
			})
			.catch((error) => {
				console.error('Failed to load GeoJSON point data:', error);
			});

		// Cleanup on unmount or data change
		return () => {
			if (viewer && !viewer.isDestroyed()) {
				viewer.dataSources.remove(dataSource);
			}
		};
	});
</script>
