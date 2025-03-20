// グローバル型定義をマジでイケてる感じに拡張！
interface Window {
    CESIUM_BASE_URL?: string;
    Cesium: {
        Viewer: new (container: HTMLElement | string, options?: any) => any;
        Cartesian3: {
            fromDegrees: (longitude: number, latitude: number, height?: number) => any;
        };
    };
}
