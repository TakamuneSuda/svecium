<script lang="ts">
	import {
		GeoJsonDataSource,
		Color,
		Cartesian3,
		Cartographic,
		ColorMaterialProperty,
		ConstantProperty
	} from 'cesium';
	import { getMapContext } from '$lib/contexts.svelte';
	import { onDestroy, onMount } from 'svelte';
	import type { GeoJSONLineProps } from '$lib/types';

	// Props
	const {
		data,
		color = '#ff0000',
		opacity = 1,
		lineWidth = 2,
		clampToGround = false,
		heightOffset,
		show = true
	}: GeoJSONLineProps = $props();

	// Get map context
	const { viewer } = getMapContext();

	let dataSource = new GeoJsonDataSource();

	onMount(async () => {
		if (!viewer || !data) return;

		try {
			// Filter out non-linestring features
			const lineFeatures = {
				type: 'FeatureCollection',
				features:
					'features' in data
						? data.features.filter((f) => f.geometry?.type === 'LineString')
						: 'geometry' in data && data.geometry?.type === 'LineString'
							? [data]
							: []
			};

			// Load data with initial styles
			dataSource = await GeoJsonDataSource.load(lineFeatures, {
				clampToGround,
				stroke: Color.fromCssColorString(color).withAlpha(opacity),
				strokeWidth: lineWidth
			});

			// Apply height offset if specified
			if (heightOffset !== undefined) {
				for (const entity of dataSource.entities.values) {
					if (entity.polyline?.positions) {
						const positions = entity.polyline.positions.getValue();
						if (positions) {
							const cartographicPositions = positions.map((position: Cartesian3) =>
								Cartographic.fromCartesian(position)
							);
							const offsetPositions = cartographicPositions.map((position: Cartographic) => {
								position.height += heightOffset;
								return Cartesian3.fromRadians(
									position.longitude,
									position.latitude,
									position.height
								);
							});
							entity.polyline.positions = offsetPositions;
						}
					}
				}
			}

			viewer.dataSources.add(dataSource);
		} catch (error) {
			console.error('Error loading GeoJSON data:', error);
		}
	});

	onDestroy(() => {
		if (viewer && !viewer.isDestroyed()) {
			viewer.dataSources.remove(dataSource);
		}
	});

	$effect(() => {
		if (!viewer || viewer.isDestroyed() || !dataSource?.entities) return;

		try {
			// エンティティの表示/非表示を制御
			dataSource.show = show;

			// 新しいマテリアルを作成
			const material = new ColorMaterialProperty(
				Color.fromCssColorString(color).withAlpha(opacity)
			);

			// 一括更新のためにバッチ処理を使用
			viewer.entities.suspendEvents();
			for (const entity of dataSource.entities.values) {
				if (entity.polyline) {
					entity.polyline.material = material;
					entity.polyline.width = new ConstantProperty(lineWidth);
				}
			}
			viewer.entities.resumeEvents();
		} catch (error) {
			console.error(
				`Error updating line style with color [${color}] and opacity [${opacity}]:`,
				error
			);
		}
	});
</script>
