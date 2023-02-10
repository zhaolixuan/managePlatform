/* eslint-disable no-unused-vars */
import mapboxgl from 'mapbox-gl';

// Generated with util/create-component.js
export interface MarkerProps extends mapboxgl.MarkerOptions{
    LngLat: mapboxgl.LngLatLike;
    map?: any;
    draggable?:boolean;
    children?: HTMLElement | React.ReactElement;
    onClick?: (event: any) => void;
    onDoubleClick?: (event: any) => void;
    onMouseEnter?: (event: any) => void;
    onMouseLeave?: (event: any) => void;
}
