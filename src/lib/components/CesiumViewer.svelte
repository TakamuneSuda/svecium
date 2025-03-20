<!--
@component

-->
<script lang="ts">
	import { onMount, onDestroy, createEventDispatcher } from 'svelte';
	import { CESIUM_INITIAL_OPTIONS, type CameraPosition } from '../utils/cesiumUtils.js';
	import { Viewer, Cartesian3 } from 'cesium';
	import 'cesium/Build/Cesium/Widgets/widgets.css';

	// Props
	export let initialCameraPosition: CameraPosition | undefined = undefined;
	export let options: Partial<typeof CESIUM_INITIAL_OPTIONS> = {};

	// マジでイケてるイベントディスパッチャー！
	const dispatch = createEventDispatcher<{
		ready: { viewer: Viewer };
		error: Error;
	}>();

	// ビューアーの初期化用の変数
	let viewer: Viewer;
	let container: HTMLElement;

	onMount(() => {
		try {
			// マジでイケてる感じにCesiumのアセットパスを設定！
			if (typeof window !== 'undefined') {
				window.CESIUM_BASE_URL = new URL(
					'../../@TakamuneSuda/svecium/cesium/dist',
					import.meta.url
				).href;
			}

			// マジでイケてる感じにビューアーを初期化！
			viewer = new Viewer(container, {
				...CESIUM_INITIAL_OPTIONS,
				...options
			});

			// 初期カメラ位置の設定
			if (initialCameraPosition) {
				viewer.camera.setView({
					destination: Cartesian3.fromDegrees(
						initialCameraPosition.longitude,
						initialCameraPosition.latitude,
						initialCameraPosition.height
					)
				});
			}

			// 準備完了イベントの発火
			dispatch('ready', { viewer });
		} catch (error) {
			console.error('マジでバッド！Cesiumの初期化に失敗しました:', error);
			dispatch('error', error as Error);
		}
	});

	onDestroy(() => {
		if (viewer) {
			viewer.destroy();
		}
	});
</script>

<div bind:this={container} class="w-full h-full">
	<slot {viewer} />
</div>

<style>
	div {
		width: 100%;
		height: 100%;
	}
</style>
