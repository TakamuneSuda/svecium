<script lang="ts">
	import CesiumViewer from '$lib/components/CesiumViewer.svelte';

	const initialPosition = {
		longitude: 139.7671, // 東京駅の経度
		latitude: 35.6812, // 東京駅の緯度
		height: 1000 // 高度（メートル）
	};
</script>

<div class="container">
	<div class="map-container">
		<CesiumViewer
			initialCameraPosition={initialPosition}
			options={{
				animation: false,
				timeline: false,
				navigationHelpButton: false
			}}
		/>
	</div>
</div>

<style>
	.container {
		width: 100%;
		height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.map-container {
		flex: 1;
		min-height: 0;
	}
</style>
