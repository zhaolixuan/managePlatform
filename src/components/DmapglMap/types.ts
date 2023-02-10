import { MapProps } from './BaseMap/BaseMap.types';
// 经纬度
export type LngLat =
  | { lng: number; lat: number }
  | { lon: number; lat: number }
  | [number, number];

export interface LngLatBounds {
  sw: LngLat; // 范围框的西南角
  ne: LngLat; // 范围框的东北角
}

export interface ComponentBase extends MapProps {
  map?: any;
  id: string; // 图层的id
  layerReady?: any; // 图层添加完成后的回调
  data?: []; // 需要渲染的数据
  valueKey?: string; // 从数据中取值的key
  color?: string; // 展示的颜色
}

export interface BaseLayerProps {
  id: string;
  map: mapboxgl.Map;
}
