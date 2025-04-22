<script lang="ts">
	import { getMapContext } from '$lib/contexts.svelte';
	import { Cartesian3, Math as CesiumMath, HeadingPitchRoll } from 'cesium';

	// 個別のプロパティとして定義
	let {
		longitude = $bindable(0),
		latitude = $bindable(0),
		height = $bindable(1000),
		heading = $bindable(0),
		pitch = $bindable(-90),
		roll = $bindable(0)
	} = $props();

	// Get map context
	const mapCtx = getMapContext();

	// Update camera when position or orientation changes
	$effect(() => {
		const viewer = mapCtx.viewer;
		if (!viewer) return;

		const camera = viewer.camera;
		let isUpdating = false;

		// Update camera position and orientation
		const updateCamera = () => {
			if (isUpdating) return;
			isUpdating = true;

			const destination = Cartesian3.fromDegrees(longitude ?? 0, latitude ?? 0, height ?? 1000);
			const orientation = HeadingPitchRoll.fromDegrees(heading ?? 0, pitch ?? -90, roll ?? 0);

			camera.setView({
				destination,
				orientation
			});

			isUpdating = false;
		};

		// Update state from camera
		const updateState = () => {
			if (isUpdating) return;
			isUpdating = true;

			const cartographic = camera.positionCartographic;
			longitude = Number(CesiumMath.toDegrees(cartographic.longitude).toFixed(6));
			latitude = Number(CesiumMath.toDegrees(cartographic.latitude).toFixed(6));
			height = Number(cartographic.height.toFixed(6));
			heading = Number(CesiumMath.toDegrees(camera.heading).toFixed(6));
			pitch = Number(CesiumMath.toDegrees(camera.pitch).toFixed(6));
			roll = Number(CesiumMath.toDegrees(camera.roll).toFixed(6));

			isUpdating = false;
		};

		// Initial update
		updateCamera();

		// Add listeners
		camera.changed.addEventListener(updateState);
		viewer.scene.preRender.addEventListener(updateState);

		// Clean up
		return () => {
			camera.changed.removeEventListener(updateState);
			viewer.scene.preRender.removeEventListener(updateState);
		};
	});
</script>
