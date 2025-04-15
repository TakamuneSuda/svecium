<script lang="ts">
	import { getMapContext } from '$lib/contexts.svelte';
	import { CesiumTerrainProvider, IonResource } from 'cesium';

	import type { TerrainProps } from '$lib/types';

	// Props
	const { assetId } = $props() satisfies TerrainProps;

	// Get map context
	const mapCtx = getMapContext();

	// Setup terrain provider
	async function setupTerrainProvider(id: number) {
		const viewer = mapCtx.viewer;
		if (!viewer) return;

		try {
			viewer.terrainProvider = await CesiumTerrainProvider.fromUrl(IonResource.fromAssetId(id, {}));
		} catch (error) {
			console.error('Failed to setup terrain provider:', error);
		}
	}

	$effect(() => {
		if (!assetId) return;
		setupTerrainProvider(assetId);
	});
</script>
