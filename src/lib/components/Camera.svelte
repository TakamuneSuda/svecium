<script lang="ts">
	import { getMapContext } from '$lib/contexts.svelte';
	import { Cartesian3, Math as CesiumMath, HeadingPitchRoll } from 'cesium';

	import type { CameraProps } from '$lib/types';

	// Props with default values
	let {
		longitude = $bindable(0),
		latitude = $bindable(0),
		height = $bindable(1000),
		heading = $bindable(0),
		pitch = $bindable(-90),
		roll = $bindable(0)
	} = $props() satisfies CameraProps;

	// Get map context
	const mapCtx = getMapContext();

	$effect(() => {
		const viewer = mapCtx.viewer;
		if (!viewer) return;

		const camera = viewer.camera;
		let isUpdating = false;

		// update camera state
		const updateCameraState = () => {
			if (isUpdating) return;
			isUpdating = true;

			const cartographic = camera.positionCartographic;
			// Get current camera state
			const currentLongitude = Number(CesiumMath.toDegrees(cartographic.longitude).toFixed(6));
			const currentLatitude = Number(CesiumMath.toDegrees(cartographic.latitude).toFixed(6));
			const currentHeight = Number(cartographic.height.toFixed(6));
			const currentHeading = Number(CesiumMath.toDegrees(camera.heading).toFixed(6));
			const currentPitch = Number(CesiumMath.toDegrees(camera.pitch).toFixed(6));
			const currentRoll = Number(CesiumMath.toDegrees(camera.roll).toFixed(6));

			// Update only if values have changed
			if (Math.abs(currentLongitude - (longitude ?? 0)) > 0.000001) {
				longitude = currentLongitude;
			}
			if (Math.abs(currentLatitude - (latitude ?? 0)) > 0.000001) {
				latitude = currentLatitude;
			}
			if (Math.abs(currentHeight - (height ?? 0)) > 0.01) {
				height = currentHeight;
			}
			if (Math.abs(currentHeading - (heading ?? 0)) > 0.01) {
				heading = currentHeading;
			}
			if (Math.abs(currentPitch - (pitch ?? -90)) > 0.001) {
				pitch = currentPitch;
			}
			if (Math.abs(currentRoll - (roll ?? 0)) > 0.01) {
				roll = currentRoll;
			}

			isUpdating = false;
		};

		// Update camera if properties have changed
		if (!isUpdating) {
			isUpdating = true;
			const destination = Cartesian3.fromDegrees(longitude, latitude, height);
			const orientation = HeadingPitchRoll.fromDegrees(heading, pitch, roll);

			camera.setView({
				destination,
				orientation
			});
			isUpdating = false;
		}

		// Add camera.changed event listener
		camera.changed.addEventListener(updateCameraState);

		// Add scene preRender event listener
		viewer.scene.preRender.addEventListener(updateCameraState);

		// Clean up function to return
		return () => {
			camera.changed.removeEventListener(updateCameraState);
			viewer.scene.preRender.removeEventListener(updateCameraState);
		};
	});
</script>
