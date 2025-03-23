```svelte
<script lang="ts">
  import { Viewer, Imagery, Terrain, Camera } from '@TakamuneSuda/svecium';

  const ionToken = 'your_cesium_ion_token';
  const tileUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

  let latitude = 35.781236;
  let longitude = 139.7673068;
  let height = 100000;
</script>

<div class="h-screen">
  <Viewer {ionToken}>
    <Imagery url={tileUrl} minimumLevel={0} maximumLevel={19} />
    <Terrain assetId={your_terrain_asset_id} />
    <Camera
      bind:latitude
      bind:longitude
      bind:height
    />
  </Viewer>
</div>
```
