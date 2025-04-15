<script lang="ts">
	import { GeoJsonDataSource, Color, Cartesian3, Cartographic } from 'cesium';
	import { getMapContext } from '$lib/contexts.svelte';
	import type {
		LineStyle,
		LineString,
		Feature,
		FeatureCollection
	} from '$lib/types';

	// Props
	let {
		data = $bindable<FeatureCollection<LineString> | Feature<LineString> | null>(null),
		style = $bindable<LineStyle>({
			color: '#ff0000',
			opacity: 1,
			lineWidth: 2
		}),
		clampToGround = $bindable<boolean>(false),
		heightOffset = $bindable<number | undefined>(undefined)
	} = $props();

	// Get map context
	const { viewer } = getMapContext();

	// Create data source
	const dataSource = new GeoJsonDataSource('line-layer');

	// Load and style lines
	$effect(() => {
		if (!viewer || !data) return;

		// Filter out non-linestring features
		const lineFeatures = {
			type: 'FeatureCollection',
			features:
				'features' in data
					? data.features.filter((f: Feature<LineString>) => f.geometry?.type === 'LineString')
					: 'geometry' in data && data.geometry?.type === 'LineString'
						? [data]
						: []
		};

		// Load GeoJSON data
		dataSource
			.load(lineFeatures, {
				stroke: Color.fromCssColorString(style.color || '#ff0000').withAlpha(style.opacity || 1),
				strokeWidth: style.lineWidth || 2,
				clampToGround
			})
			.then(() => {
				// Apply height offset if specified
				if (heightOffset !== undefined) {
					dataSource.entities.values.forEach((entity) => {
						if (entity.polyline && entity.polyline.positions) {
							const positions = entity.polyline.positions.getValue();
							if (positions) {
								entity.polyline.positions = positions.map((position: Cartesian3) => {
									const cartographic = Cartographic.fromCartesian(position);
									return Cartesian3.fromRadians(
										cartographic.longitude,
										cartographic.latitude,
										heightOffset
									);
								});
							}
						}
					});
				}
				viewer.dataSources.add(dataSource);
			})
			.catch((error) => {
				console.error('Failed to load GeoJSON line data:', error);
			});

		// Cleanup on unmount or data change
		return () => {
			if (viewer && !viewer.isDestroyed()) {
				viewer.dataSources.remove(dataSource);
			}
		};
	});
</script>
