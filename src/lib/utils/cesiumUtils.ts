import type * as CesiumType from 'cesium';

// デフォルトのビューアーオプション
export const CESIUM_INITIAL_OPTIONS = {
    animation: false,
    timeline: false,
    navigationHelpButton: false
} as const;

// カメラポジションの型定義
export interface CameraPosition {
    longitude: number;
    latitude: number;
    height: number;
}

// ビューアーのコンテキスト型
export interface CesiumContext {
    cesium: typeof CesiumType;
    viewer: CesiumType.Viewer;
}
