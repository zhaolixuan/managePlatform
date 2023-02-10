/* eslint-disable */
import React, { useEffect } from 'react';
import { useStore } from '@/hooks';
import { observer } from 'mobx-react';
import beijingStreet from './beijingStreet.js';

const StreetLayer = ({map}) => {
  const {activeMarkerInfo} = useStore('gis')
  const { street = '' } = activeMarkerInfo || {}
  const sourceId = 'street-layer';
  const streetData = beijingStreet.features.filter((i) => street.includes(i.properties.NAME));

  const geojsonData = {
    type: 'FeatureCollection',
    features: streetData,
  };
  let centerCoords = streetData[0]?.properties?.center
  const addSource = () => {
    if (map.getSource('street-layer')) {
      map.getSource('street-layer').setData(geojsonData);
    } else {
      map.addSource('street-layer', {
        type: 'geojson',
        data: geojsonData
      });
    }
  };
  const addLayer = () => {
    // 画出边框
    map.addLayer({
      id: 'line',
      // 图层类型
      type: 'line',
      // 数据源
      source: sourceId,
      paint: {
        'line-color': '#FFFFFF',
        'line-width': 3,
        'line-opacity': 1
      },
    },)
  };

  useEffect(() => {
    if (!map) return;
    addSource();
    addLayer();
    return(()=>{
      map.removeLayer(sourceId)
    })
  }, [street]);
  useEffect(()=>{
    if(!street || !map)return;
    map.getSource(sourceId)?.setData(geojsonData);

    if(centerCoords){
      map.easeTo({center:centerCoords,zoom:9})
    }
  },[street,centerCoords]);
  return null;
};

export default observer(StreetLayer);
