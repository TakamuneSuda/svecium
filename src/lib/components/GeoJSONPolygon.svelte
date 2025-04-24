<script lang="ts">
	import { GeoJsonDataSource, Color, ColorMaterialProperty } from 'cesium';
	import { getMapContext } from '$lib/contexts.svelte';
	import { onDestroy, onMount } from 'svelte';
	import type { GeoJSONPolygonProps } from '$lib/types/geojson';

	// Props
	const {
		data,
		fillColor = '#ff0000',
		fillOpacity = 0.5,
		show = true
	}: GeoJSONPolygonProps = $props();

	// Get map context
	const { viewer } = getMapContext();

	let dataSource = new GeoJsonDataSource();

	onMount(async () => {
		if (!viewer || !data) return;

		try {
			dataSource = await GeoJsonDataSource.load(data, {
				clampToGround: true,
				stroke: Color.fromCssColorString(fillColor),
				strokeWidth: 2,
				fill: Color.fromCssColorString(fillColor).withAlpha(fillOpacity)
			});

			viewer.dataSources.add(dataSource); // Add the data source to the viewer
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
				Color.fromCssColorString(fillColor).withAlpha(fillOpacity)
			);

			// 一括更新のためにバッチ処理を使用
			viewer.entities.suspendEvents();
			for (const entity of dataSource.entities.values) {
				if (entity.polygon) {
					entity.polygon.material = material;
				}
			}
			viewer.entities.resumeEvents();
		} catch (error) {
			console.error(
				`Error updating polygon style with color [${fillColor}] and opacity [${fillOpacity}]:`,
				error
			);
		}
	});
</script>
