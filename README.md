# svecium

**svecium** is a minimal Svelte 5 component library that wraps CesiumJS, making it easy to build interactive 3D globes and maps in Svelte apps. Compose Cesium features using simple Svelte components—no boilerplate, no hassle.

---

## How to Build (Setup)

### 1. Vite Configuration (`vite.config.ts`)

You **must** configure your Vite project as follows to use svecium with CesiumJS:

```ts
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
	plugins: [
		sveltekit(),
		viteStaticCopy({
			targets: [
				{ src: 'node_modules/cesium/Build/Cesium/Workers/*', dest: 'cesium/Workers' },
				{ src: 'node_modules/cesium/Build/Cesium/Assets/*', dest: 'cesium/Assets' },
				{ src: 'node_modules/cesium/Build/Cesium/Widgets/*', dest: 'cesium/Widgets' },
				{ src: 'node_modules/cesium/Build/Cesium/ThirdParty/*', dest: 'cesium/ThirdParty' }
			]
		})
	],
	define: {
		CESIUM_BASE_URL: JSON.stringify('/cesium')
	}
});
```

### 2. Import Cesium CSS

You **must** import Cesium’s widget CSS in your app (typically where you use the `Viewer` component):

```js
import 'cesium/Build/Cesium/Widgets/widgets.css';
```

### 3. Requirements

- Svelte 5
- CesiumJS
- Vite

---

# Components

## Viewer

The `Viewer` component creates a Cesium Viewer instance and allows you to compose map-related child components (such as `Terrain`, `Imagery`, `Camera`, etc.) inside.

### Props

| Name     | Type   | Required | Description                                                                        |
| -------- | ------ | -------- | ---------------------------------------------------------------------------------- |
| ionToken | string | Optional | Cesium Ion access token. Required for Cesium Ion assets (e.g., terrain, 3D Tiles). |
| children | slot   | Optional | Map-related child components. Usually required for meaningful usage.               |

> **Note:**
>
> - `ionToken` is optional in the type definition, but required if you use Cesium Ion assets.
> - `children` is optional in the type definition, but the Viewer is only useful with child components such as `Terrain`, `Imagery`, `Camera`, etc.

#### Minimal Example

```svelte
<Viewer ionToken="your_ion_token">
	<Terrain assetId={1234} />
	<Imagery url={tileUrl} />
	<Camera ...props />
</Viewer>
```

```ts
interface ViewerProps {
	ionToken?: string;
	children?: Snippet<[Viewer]>;
}
```

---

## Terrain

The `Terrain` component adds a Cesium terrain provider to the `Viewer` context using a Cesium Ion asset.

### Props

| Name    | Type   | Required | Description                                  |
| ------- | ------ | -------- | -------------------------------------------- |
| assetId | number | Optional | Cesium Ion asset ID for the terrain provider |

#### Minimal Example

```svelte
<Viewer ionToken="your_ion_token">
	<Terrain assetId={1234} />
</Viewer>
```

```ts
interface TerrainProps {
	assetId?: number;
}
```

---

## Camera

The `Camera` component sets the initial camera position and orientation for the Cesium Viewer. You can control the view by specifying longitude, latitude, height, heading, pitch, and roll. All props are optional and bindable for reactive camera control.

### Props

| Name      | Type   | Required | Description          |
| --------- | ------ | -------- | -------------------- |
| longitude | number | Optional | Longitude in degrees |
| latitude  | number | Optional | Latitude in degrees  |
| height    | number | Optional | Height in meters     |
| heading   | number | Optional | Heading in degrees   |
| pitch     | number | Optional | Pitch in degrees     |
| roll      | number | Optional | Roll in degrees      |

#### Minimal Example

```svelte
<Viewer ionToken="your_ion_token">
	<Camera longitude={139.7673} latitude={35.6812} height={1000} heading={0} pitch={-30} roll={0} />
</Viewer>
```

```ts
interface CameraProps {
	longitude?: number;
	latitude?: number;
	height?: number;
	heading?: number;
	pitch?: number;
	roll?: number;
}
```

---

## Imagery

The `Imagery` component adds a raster tile imagery layer to the Cesium Viewer using a URL template (e.g., OpenStreetMap, Mapbox, XYZ, etc.).

### Props

| Name         | Type   | Required | Description                      |
| ------------ | ------ | -------- | -------------------------------- |
| url          | string | Required | URL template for raster tiles    |
| minimumLevel | number | Optional | Minimum zoom level (default: 0)  |
| maximumLevel | number | Optional | Maximum zoom level (default: 18) |

#### Minimal Example

```svelte
<Viewer ionToken="your_ion_token">
	<Imagery
		url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
		minimumLevel={0}
		maximumLevel={19}
	/>
</Viewer>
```

```ts
interface ImageryProps {
	url: string;
	minimumLevel?: number;
	maximumLevel?: number;
}
```

---

## GeoJSONPoint

The `GeoJSONPoint` component renders GeoJSON Point features on the Cesium globe. You can style points with custom images, colors, size, and more.

### Props

| Name          | Type                                               | Required | Description                                                                |
| ------------- | -------------------------------------------------- | -------- | -------------------------------------------------------------------------- |
| data          | FeatureCollection<Point> \| Feature<Point> \| null | Yes      | GeoJSON Point feature or feature collection.                               |
| style         | PointStyle                                         | Optional | Style options for points (color, opacity, pointSize, outline, image, etc). |
| clampToGround | boolean                                            | Optional | Clamp points to ground (default: false).                                   |
| heightOffset  | number                                             | Optional | Pixel offset from ground (default: undefined).                             |

#### Minimal Example

```svelte
<Viewer ionToken="your_ion_token">
	<GeoJSONPoint
		data={geojsonPointData}
		style={{
			pointImage: imageUrl, // image url
			imageWidth: 32,
			imageHeight: 48,
			rotation: 45,
			anchorX: 0.5,
			anchorY: 1,
			color: '#4169e1',
			opacity: 0.8
		}}
		clampToGround={true}
	/>
</Viewer>
```

```ts
interface GeoJSONPointProps {
	data: FeatureCollection<Point> | Feature<Point> | null;
	style?: PointStyle;
	clampToGround?: boolean;
	heightOffset?: number;
}
```

---

## GeoJSONLine

The `GeoJSONLine` component renders GeoJSON LineString features as polylines on the Cesium globe. Supports color, width, opacity, outline, and ground clamping.

### Props

| Name          | Type                                                         | Required | Description                                                        |
| ------------- | ------------------------------------------------------------ | -------- | ------------------------------------------------------------------ |
| data          | FeatureCollection<LineString> \| Feature<LineString> \| null | Yes      | GeoJSON LineString feature or feature collection.                  |
| style         | LineStyle                                                    | Optional | Style options for lines (color, opacity, lineWidth, outline, etc). |
| clampToGround | boolean                                                      | Optional | Clamp lines to ground (default: false).                            |
| heightOffset  | number                                                       | Optional | Height offset for line positions (default: undefined).             |

#### Minimal Example

```svelte
<Viewer ionToken="your_ion_token">
	<GeoJSONLine
		data={geojsonLineData}
		style={{
			color: '#ff0000',
			opacity: 1,
			lineWidth: 12,
			outlineColor: '#ffffff',
			outlineWidth: 1
		}}
		clampToGround={true}
	/>
</Viewer>
```

```ts
interface GeoJSONLineProps {
	data: FeatureCollection<LineString> | Feature<LineString> | null;
	style?: LineStyle;
	clampToGround?: boolean;
	heightOffset?: number;
}
```

---

## GeoJSONPolygon

The `GeoJSONPolygon` component renders GeoJSON Polygon features as filled polygons on the Cesium globe. You can style fill color, opacity, outline, and more.

### Props

| Name  | Type                                                   | Required | Description                                                                           |
| ----- | ------------------------------------------------------ | -------- | ------------------------------------------------------------------------------------- |
| data  | FeatureCollection<Polygon> \| Feature<Polygon> \| null | Yes      | GeoJSON Polygon feature or feature collection.                                        |
| style | PolygonStyle                                           | Optional | Style options for polygons (fillColor, fillOpacity, outlineColor, outlineWidth, etc). |

#### Minimal Example

```svelte
<Viewer ionToken="your_ion_token">
	<GeoJSONPolygon
		data={geojsonPolygonData}
		style={{
			fillColor: '#ff0000',
			fillOpacity: 0.5,
			outlineColor: '#000000',
			outlineWidth: 2
		}}
	/>
</Viewer>
```

```ts
interface GeoJSONPolygonProps {
	data: FeatureCollection<Polygon> | Feature<Polygon> | null;
	style?: PolygonStyle;
}
```

---

## Mvt

The `Mvt` component adds a Mapbox Vector Tile (MVT) layer to the Cesium globe using an MVT imagery provider. You can customize stroke color, fill color, line width, and handle feature selection.

### Props

| Name            | Type                   | Required | Description                                     |
| --------------- | ---------------------- | -------- | ----------------------------------------------- |
| url             | string                 | Yes      | URL template for the MVT tiles.                 |
| layerName       | string                 | Yes      | Name of the vector tile layer to display.       |
| strokeStyle     | string                 | Optional | Stroke color for features (default: '#000000'). |
| fillStyle       | string                 | Optional | Fill color for features (default: '#ffffff').   |
| lineWidth       | number                 | Optional | Line width for features (default: 2).           |
| onSelectFeature | (feature: any) => void | Optional | Callback when a feature is selected.            |

#### Minimal Example

```svelte
<Viewer ionToken="your_ion_token">
	<Mvt
		url="https://example.com/tiles/{z}/{x}/{y}.pbf"
		layerName="myLayer"
		strokeStyle="#0080ff"
		fillStyle="#00ff80"
		lineWidth={3}
		onSelectFeature={(feature) => console.log(feature)}
	/>
</Viewer>
```

```ts
interface MvtProps {
	url: string;
	layerName: string;
	strokeStyle?: string;
	fillStyle?: string;
	lineWidth?: number;
	onSelectFeature?: (feature: any) => void;
}
```

---

## Full Example: All-in Svelte Globe

```svelte
<script lang="ts">
	import {
		Viewer,
		Imagery,
		Terrain,
		Camera,
		GeoJSONPoint,
		GeoJSONLine,
		GeoJSONPolygon,
		Mvt
	} from '@TakamuneSuda/svecium';

	const ionToken = 'your_cesium_ion_token';
	const tileUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
	const mvtUrl = 'https://example.com/tiles/{z}/{x}/{y}.pbf';
	const mvtLayer = 'myLayer';

	// GeoJSONデータ例
	const geojsonPointData = {
		type: 'FeatureCollection',
		features: [
			{
				type: 'Feature',
				geometry: { type: 'Point', coordinates: [139.7673068, 35.681236] },
				properties: { name: 'Tokyo Station' }
			}
		]
	};
	const geojsonLineData = {
		type: 'FeatureCollection',
		features: [
			{
				type: 'Feature',
				geometry: {
					type: 'LineString',
					coordinates: [
						[139.76, 35.68],
						[139.77, 35.69]
					]
				},
				properties: {}
			}
		]
	};
	const geojsonPolygonData = {
		type: 'FeatureCollection',
		features: [
			{
				type: 'Feature',
				geometry: {
					type: 'Polygon',
					coordinates: [
						[
							[139.76, 35.68],
							[139.77, 35.68],
							[139.77, 35.69],
							[139.76, 35.69],
							[139.76, 35.68]
						]
					]
				},
				properties: {}
			}
		]
	};
	const imageUrl = 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Pleiades_large.jpg';

	let latitude = $state(35.681236);
	let longitude = $state(139.7673068);
	let height = $state(10000);
	let heading = $state(0);
	let pitch = $state(-30);
	let roll = $state(0);
</script>

<div class="h-screen">
	<Viewer {ionToken}>
		<Terrain assetId={1234} />
		<Imagery url={tileUrl} minimumLevel={0} maximumLevel={19} />
		<Camera bind:latitude bind:longitude bind:height bind:heading bind:pitch bind:roll />
		<GeoJSONPoint
			data={geojsonPointData}
			style={{
				pointImage: imageUrl,
				imageWidth: 32,
				imageHeight: 48,
				rotation: 0,
				anchorX: 0.5,
				anchorY: 1,
				color: '#4169e1',
				opacity: 0.8
			}}
			clampToGround={true}
		/>
		<GeoJSONLine
			data={geojsonLineData}
			style={{
				color: '#ff0000',
				opacity: 1,
				lineWidth: 8,
				outlineColor: '#ffffff',
				outlineWidth: 2
			}}
			clampToGround={true}
		/>
		<GeoJSONPolygon
			data={geojsonPolygonData}
			style={{
				fillColor: '#ff0000',
				fillOpacity: 0.5,
				outlineColor: '#000000',
				outlineWidth: 2
			}}
		/>
		<Mvt
			url={mvtUrl}
			layerName={mvtLayer}
			strokeStyle="#0080ff"
			fillStyle="#00ff80"
			lineWidth={3}
			onSelectFeature={(feature) => console.log('MVT feature selected:', feature)}
		/>
	</Viewer>
</div>
```
