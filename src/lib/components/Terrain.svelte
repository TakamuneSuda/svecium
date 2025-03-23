<script lang="ts">
	import { getMapContext } from '$lib/contexts.svelte';
	import { CesiumTerrainProvider, IonResource } from 'cesium';

	// Props
	const { assetId } = $props<{
		assetId?: number;
	}>();

	// Get map context
	const mapCtx = getMapContext();

	// Setup terrain provider
	async function setupTerrainProvider(id: number) {
		const viewer = mapCtx.viewer;
		if (!viewer) return;

		try {
			const terrainProvider = await CesiumTerrainProvider.fromUrl(
				await IonResource.fromAssetId(id, {})
			);
			viewer.terrainProvider = terrainProvider;
		} catch (error) {
			console.error('Failed to setup terrain provider:', error);
		}
	}

	$effect(() => {
		if (!assetId) return;
		setupTerrainProvider(assetId);
	});
</script>
