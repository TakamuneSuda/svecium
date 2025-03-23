<script lang="ts">
	import { UrlTemplateImageryProvider } from 'cesium';
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
		viewer.imageryLayers.addImageryProvider(provider);
	});
</script>
