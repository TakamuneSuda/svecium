<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import { Viewer, Ion } from 'cesium';
	import { prepareMapContext } from '$lib/contexts.svelte';
	import 'cesium/Build/Cesium/Widgets/widgets.css';

	type ViewerConstructorOptions = ConstructorParameters<typeof Viewer>[1];

	type Props = {
		ionToken?: string;
		children?: Snippet<[viewer: Viewer]>;
	} & Omit<ViewerConstructorOptions, 'container'>;

	let { ionToken = '', children, ...viewerOptions }: Props = $props();
	let container: HTMLDivElement;
	let viewer: Viewer | null = $state(null);
	const mapCtx = prepareMapContext();

	onMount(() => {
		// Initialize Cesium Ion
		if (ionToken) {
			Ion.defaultAccessToken = ionToken;
		}

		// eslint-disable-next-line no-undef
		if (!CESIUM_BASE_URL) {
			console.warn(
				"CESIUM_BASE_URL is not defined. May be failed to load cesium. Make sure to define it in your environment variables to load cesium's assets."
			);
		}

		// Initialize Cesium viewer
		const initialOptions = $state.snapshot(viewerOptions);

		// デフォルトの地形を無効化
		const options = {
			...initialOptions,
			terrainProvider: undefined
		};

		viewer = new Viewer(container, options);

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

<div bind:this={container} class="cesium-viewer-container">
	{#if viewer && children}
		{@render children(viewer)}
	{/if}
</div>
