<script lang="ts">
	import { onMount } from 'svelte';
	import { Viewer } from 'cesium';
	import { prepareMapContext } from '$lib/contexts.svelte';

	// Load Cesium styles
	import 'cesium/Build/Cesium/Widgets/widgets.css';

	let container: HTMLDivElement;
	let viewer: Viewer | null = null;

	// Setup map context
	const mapCtx = prepareMapContext();

	onMount(() => {
		if (!CESIUM_BASE_URL) {
			console.warn(
				"CESIUM_BASE_URL is not defined. May be failed to load cesium. Make sure to define it in your environment variables to load cesium's assets."
			);
		}

		// Initialize Cesium viewer
		viewer = new Viewer(container);

		// Set the viewer instance to the context
		mapCtx.viewer = viewer;

		return () => {
			if (viewer) {
				// Delete the viewer instance from the context
				mapCtx.viewer = null;
				viewer.destroy();
			}
		};
	});
</script>

<div bind:this={container} class="w-full h-full">
	<slot />
</div>
