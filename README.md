```svelte
<script lang="ts">
	import { Viewer, Imagery, Terrain, Camera } from '@TakamuneSuda/svecium';

	const ionToken = 'your_cesium_ion_token';
	const tileUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

	let latitude = $state(35.781236);
	let longitude = $state(139.7673068);
	let height = $state(100000);
	let heading = $state(0);
	let pitch = $state(-30);
	let roll = $state(0);
</script>

<div class="h-screen">
	<Viewer {ionToken}>
		<Terrain assetId={your_terrain_asset_id} />
		<Imagery url={tileUrl} minimumLevel={0} maximumLevel={19} />
		<Camera bind:latitude bind:longitude bind:height bind:heading bind:pitch bind:roll />
		<GeoJSONPoint
			data={geojsonPointData}
			style={{
				pointImage: { imageUrl }, // image url
				imageWidth: 32, // image width (pixel)
				imageHeight: 48, // image height (pixel)
				rotation: 45, // rotation angle (degree)
				anchorX: 0.5, // horizontal anchor point (center)
				anchorY: 1, // vertical anchor point (bottom)
				color: '#4169e1', // image provided: update color, not provided: point color
				opacity: 0.8 // image provided: update opacity, not provided: point opacity
			}}
			clampToGround={true} // clamp to ground
		/>
		<GeoJSONLine
			data={geojsonLineData}
			style={{
				color: '#ff0000', // line color
				opacity: 1, // line opacity
				lineWidth: 12, // line width
				outlineColor: '#ffffff', // outline color
				outlineWidth: 1 // outline width
			}}
			clampToGround={true} // clamp to ground
		/>
		<GeoJSONPolygon
			data={geojsonPolygonData}
			style={{
				color: '#ffffff', //
				opacity: 1, // 境界線の透明度
				outlineColor: '#000000', // アウトラインの色
				outlineWidth: 2, // アウトラインの幅
				fillColor: '#ff0000', // 塗りつぶしの色
				fillOpacity: 0.5 // 塗りつぶしの透明度
			}}
		/>

	</Viewer>
</div>
```
