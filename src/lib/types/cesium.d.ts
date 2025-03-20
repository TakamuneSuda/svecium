// マジでイケてるCesiumの型定義！
declare namespace Cesium {
    class Viewer {
        constructor(container: HTMLElement | string, options?: any);
        destroy(): void;
        camera: Camera;
    }

    class Camera {
        setView(options: {
            destination: Cartesian3;
        }): void;
    }

    class Cartesian3 {
        static fromDegrees(longitude: number, latitude: number, height?: number): Cartesian3;
    }
}
