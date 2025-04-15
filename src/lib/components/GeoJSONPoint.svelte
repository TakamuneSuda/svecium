<script lang="ts">
	import { GeoJsonDataSource, Color, Entity, Cartesian3, Cartesian2, BillboardGraphics, ColorMaterialProperty, PointGraphics, HeightReference } from 'cesium';
	import { getMapContext } from '$lib/contexts.svelte';
	import type { PointStyle, GeoJSONPointProps, Point, Feature, FeatureCollection } from '$lib/types';

	type $$Props = GeoJSONPointProps;

	// Props
	let {
		data = $bindable<FeatureCollection<Point> | Feature<Point> | null>(null),
		style = $bindable<PointStyle>({
			color: '#4169e1', // ROYALBLUE
			opacity: 1,
			pointSize: 10,
			outlineColor: '#000000',
			outlineWidth: 2,
			pointImage: undefined
		}),
		clampToGround = $bindable<boolean>(false),
		heightOffset = $bindable<number | undefined>(undefined)
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
			.load(pointFeatures)
			.then(() => {
				// カスタマイズ各ポイントのスタイル
				dataSource.entities.values.forEach((entity: Entity) => {
					if (entity.position) {
						// 画像URLが指定されている場合はBillboardを使用
						if (style.pointImage) {
							entity.billboard = new BillboardGraphics({
								image: style.pointImage,
								// 幅と高さが指定されている場合は、それを使用
								width: style.imageWidth,
								height: style.imageHeight,
								// 幅と高さが指定されていない場合は、pointSizeをスケールとして使用
								scale: !style.imageWidth && !style.imageHeight ? (style.pointSize || 10) / 10 : undefined,
								color: Color.fromCssColorString(style.color || '#4169e1').withAlpha(
									style.opacity || 1
								),
								// 回転角度（度数法）
								rotation: style.rotation ? (style.rotation * Math.PI) / 180 : 0,
								// アンカーポイント（デフォルトは中心）
								verticalOrigin: style.anchorY ?? 0.5,
								horizontalOrigin: style.anchorX ?? 0.5,
								// 地表面への固定
								heightReference: clampToGround ? HeightReference.CLAMP_TO_GROUND : HeightReference.NONE,
								// 高さオフセット
								pixelOffset: heightOffset ? new Cartesian2(0, heightOffset) : undefined
							});
							// デフォルトのポイントを非表示に
							entity.point = undefined;
						} else {
							// 通常のポイントスタイル
							entity.point = new PointGraphics({
								color: new ColorMaterialProperty(Color.fromCssColorString(style.color || '#4169e1').withAlpha(
									style.opacity || 1
								)),
								pixelSize: style.pointSize || 10,
								outlineColor: style.outlineWidth
									? new ColorMaterialProperty(Color.fromCssColorString(style.outlineColor || '#000000'))
									: undefined,
								outlineWidth: style.outlineWidth || 0,
								// 地表面への固定
								heightReference: style.clampToGround ? HeightReference.CLAMP_TO_GROUND : HeightReference.NONE
							});
						}
					}
				});
				viewer.dataSources.add(dataSource);
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
