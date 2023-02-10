 
// eslint-disable-next-line import/no-cycle
import { LngLat } from '../types';

export interface MapProps {
  accessToken?: string;
  style?: string | mapboxgl.Style/*  | object */;
  center?: LngLat;
  zoom?: number;
  minZoom?:number;
  maxZoom?:number;
  children?: any;
  height?: string | number;
  pitch?: number;
  bearing?: number;
  antialias?:boolean,
  epsg?:string,
  resize?: any;
  remove?: any;
  mousedown?: any;
  mouseup?: any;
  mouseover?: any;
  mousemove?: any;
  click?: any;
  dblclick?: any;
  mouseenter?: any;
  mouseleave?: any;
  mouseout?: any;
  contextmenu?: any;
  wheel?: any;
  touchstart?: any;
  touchend?: any;
  touchmove?: any;
  touchcancel?: any;
  movestart?: any;
  move?: any;
  moveend?: any;
  dragstart?: any;
  drag?: any;
  dragend?: any;
  zoomstart?: any;
  zoomend?: any;
  rotatestart?: any;
  rotate?: any;
  rotateend?: any;
  pitchstart?: any;
  pitchend?: any;
  boxzoomstart?: any;
  boxzoomend?: any;
  boxzoomcancel?: any;
  webglcontextlost?: any;
  webglcontextrestored?: any;
  load?: any;
  render?: any;
  idle?: any;
  error?: any;
  data?: any;
  styledata?: any;
  sourcedata?: any;
  dataloading?: any;
  styledataloading?: any;
  sourcedataloading?: any;
  styleimagemissing?: any;

  button?: any; // storybook用的测试按钮
}