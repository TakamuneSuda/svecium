<script lang="ts">
	import { onDestroy } from 'svelte';
	import { UrlTemplateImageryProvider, ImageryLayer } from 'cesium';
	import { getMapContext } from '$lib/contexts.svelte';

	// Props
	const {
		url,
		minimumLevel = 0,
		maximumLevel = 18
	} = $props<{
		url: string;
		minimumLevel?: number;
		maximumLevel?: number;
	}>();

	// Get map context
	const mapCtx = getMapContext();

	// Layer instance
	let layer: ImageryLayer | null = null;

	$effect(() => {
		const viewer = mapCtx.viewer;

		if (!viewer) {
			return;
		}

		// Create imagery provider
		const provider = new UrlTemplateImageryProvider({
			url,
			minimumLevel,
			maximumLevel,
			enablePickFeatures: false
		});

		// Add layer to viewer
		layer = viewer.imageryLayers.addImageryProvider(provider);

		// Cleanup when effect is re-run
		return () => {
			if (layer) {
				viewer.imageryLayers.remove(layer);
				layer = null;
			}
		};
	});

	// Cleanup on component destroy
	onDestroy(() => {
		if (layer && mapCtx.viewer) {
			mapCtx.viewer.imageryLayers.remove(layer);
			layer = null;
		}
	});
</script>
