<script lang="ts">
	import { UrlTemplateImageryProvider } from 'cesium';
	import { getMapContext } from '$lib/contexts.svelte';

	// Props
	const {
		url,
		minimumLevel = 0,
		maximumLevel = 18,
		opacity = $bindable(1),
		show = $bindable(true)
	} = $props<{
		url: string;
		minimumLevel?: number;
		maximumLevel?: number;
		opacity?: number;
		show?: boolean;
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
		const layer = viewer.imageryLayers.addImageryProvider(provider);
		if (layer) {
			$effect(() => {
				layer.alpha = opacity;
			});
			$effect(() => {
				layer.show = show;
			});
		}
	});
</script>
