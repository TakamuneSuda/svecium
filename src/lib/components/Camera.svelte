<script lang="ts">
	import { getMapContext } from '$lib/contexts.svelte';
	import { Cartesian3, Math as CesiumMath, HeadingPitchRoll } from 'cesium';

	// Props with default values
	let {
		longitude = undefined,
		latitude = undefined,
		height = undefined,
		heading = undefined,
		pitch = undefined,
		roll = undefined
	} = $props();

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
		if (!isUpdating && longitude !== undefined && latitude !== undefined) {
			isUpdating = true;
			const destination = Cartesian3.fromDegrees(longitude, latitude, height ?? 1000);
			const orientation = HeadingPitchRoll.fromDegrees(heading ?? 0, pitch ?? -90, roll ?? 0);

			camera.setView({
				destination,
				orientation
			});
			isUpdating = false;
		}

		console.log('Setting up camera event listeners');

		// Add camera.changed event listener
		camera.changed.addEventListener(updateCameraState);

		// Add scene preRender event listener
		viewer.scene.preRender.addEventListener(updateCameraState);

		// Clean up function to return
		return () => {
			console.log('Cleaning up camera event listeners');
			camera.changed.removeEventListener(updateCameraState);
			viewer.scene.preRender.removeEventListener(updateCameraState);
		};
	});
</script>
