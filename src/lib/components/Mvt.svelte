<script lang="ts">
	import { getMapContext } from '$lib/contexts.svelte';
    import CesiumMVTImageryProvider from 'cesium-mvt-imagery-provider';

	// Props
	const {
		url,
        layerName,
        strokeStyle = '#000000',
        lineWidth = 2,
        fillStyle = '#ffffff',
        onSelectFeature
	} = $props<{
		url: string;
        layerName: string;
        strokeStyle?: string;
        fillStyle?: string;
        lineWidth?: number;
        onSelectFeature?: (feature: any) => void;
	}>();

	// Get map context
	const mapCtx = getMapContext();

	$effect(() => {
		const viewer = mapCtx.viewer;

		if (!viewer) {
			return;
		}

        try {
            const imageryProviderInstance = createImageryProvider();
            viewer.imageryLayers.addImageryProvider(imageryProviderInstance);
        } catch (error) {
            console.error('Failed to create or add MVT imagery provider:', error);
    }
	});

    function createImageryProvider() {
        return new CesiumMVTImageryProvider({
            urlTemplate: url,
            layerName: layerName,
            style: (feature: any) => {

                // base style
                let baseStyle = {
                    strokeStyle: strokeStyle,
                    fillStyle: fillStyle,
                    lineWidth: lineWidth,
                };

                return baseStyle;
            },
            onSelectFeature: (feature: any) => {
                console.log('Feature selected:', feature);
            }
        });
    }
</script>
