/* eslint-disable */
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import styles from './index.module.less';

function SingleMarkerLayer({
  data, map, showScan
}) {

  const [ marker ] = useRef();
  // const [marker, setMarker] = useState(null);

  const addMarkersLayer = () => {
    if(!showScan) return;
    const el = document.createElement('div')
    el.id = 'scan-div';
    el.className = 'scan-wrapper';
    el.style.width = '200px';
    el.style.height = '200px';
   // const m = new mapboxgl.Marker(el).setLngLat(data).addTo(map);
    const m = new window.dmapgl.Marker(el).setLngLat(data).addTo(map);

    setMarker(m);
  };

  const removeLayers = () => {
    // [...clusterLayers, ...markerLayers].forEach(layer => {
    //   map.getLayer(layer) && map.removeLayer(layer);
    // });
    marker && marker.remove();
    // scanRef.current.remove();
  };

  // 监听地图放大缩小
  useEffect(() => {
    
    if (!map || !showScan) return;
    // removeLayers();
    addMarkersLayer();
  }, [map, data, showScan]);

  useEffect(() => () => {
    removeLayers();
  }, []);

  
  if (!data) return null;

  return (
    <>
    </>
  );
}

export default SingleMarkerLayer;
