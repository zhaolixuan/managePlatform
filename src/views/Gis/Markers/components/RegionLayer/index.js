/* eslint-disable */
import React, { useEffect } from 'react';
import { useStore } from '@/hooks';
import { observer } from 'mobx-react';
import beijingStreet from './beijingStreet';

const RegionLayer = ({map, includeAllProvince = false}) => {
  const {curRegion,setIsClickedPicture,setActiveMarkerInfo,activeMarkerInfo,theme} = useStore('gis')
  // console.log(curRegion,'curRegion---')
  const sourceId = 'region-layer';
  const regionData = bjAreaBoundary.features.filter((i) => curRegion !=='北京' && curRegion.includes(i.properties.name));
  const beijingRegionData = bjAreaBoundary.features.filter((i) => '北京'.includes(i.properties.name));

  const geojsonData = {
    type: 'FeatureCollection',
    features: regionData,
  };
  const bjGeojsonData = {
    type: 'FeatureCollection',
    features: beijingRegionData,
  };
  let centerCoords
  let zoom = 6
  if(regionData.length>1){
    centerCoords = regionData[1]?.properties?.center
  } else if(regionData.length>0){
    centerCoords = regionData[0]?.properties?.center
    zoom = regionData[0]?.properties?.zoom
  } else {
    centerCoords = beijingRegionData[0]?.properties?.center
    zoom = beijingRegionData[0]?.properties?.zoom
  }
  // console.log('regionData',regionData,centerCoords,zoom)
  
  const addAllProvinceData = () => {
    // const china = require('./china');
    if (map.getSource('province-source')) {
      map.getSource('province-source').setData(chinaProvinceBoundary);
      // todo: 待确认，是否需要重新addLayer
    } else {
      map.addSource('province-source', {
        type: 'geojson',
        data: chinaProvinceBoundary
      });
    }
    const lineColor = theme === 'white' ? '#000' : '#fff';
    const textColor = theme === 'white' ? '#000' : '#fff';
    map.addLayer({
      id: 'china-line',
      // 图层类型
      type: 'line',
      // 数据源
      source: 'province-source',
      paint: {
        'line-color': lineColor,
        'line-width': 1,
        'line-opacity': 1,
      },
    })
    map.addLayer({
      id: 'china-line-text',
      // 图层类型
      type: 'symbol',
      // 数据源
      source: 'province-source',
      layout: {
        'text-field': ['get', 'name'],
        'text-size': 14,
      },
      paint: {
        'text-color': textColor,
      },
    })
  }
  const addBeijingData = () => {

    const bjLineColor = theme === 'white' ? '#2389FF' : '#03F0FF';
    const bjLineStrokeColor = theme === 'white' ? 'rgba(243, 248, 255, 1)' : "rgba(26, 38, 55, 1)"
    if (map.getSource('beijing-source')) {
      map.getSource('beijing-source').setData(bjGeojsonData);
      // todo: 待确认，是否需要重新addLayer
    } else {
      map.addSource('beijing-source', {
        type: 'geojson',
        data: bjGeojsonData
      });
    }
    map.addLayer({
      id: 'beijing-fill',
      type: 'fill',
      source: 'beijing-source',
      paint: {
        'fill-color': bjLineStrokeColor,
        'fill-opacity': 1
      }
    });
    map.moveLayer('beijing-background','区界');
    map.moveLayer('beijing-fill','区界')
    // map.moveLayer('区界','beijing-background');
    // map.moveLayer('background','beijing-fill');
    // map.moveLayer('区界','beijing-fill');
    map.addLayer({
      id: 'beijing-line',
      // 图层类型
      type: 'line',
      // 数据源
      source: 'beijing-source',
      paint: {
        'line-color': bjLineColor,
        'line-width': 3,
        'line-opacity': 1
      }
    });
  }
  const addDistrictLayer = () => {
    const regionLineColor = theme === 'white' ? '#B360F4' : '#00FFFF';
    if (map.getSource(sourceId)) {
      map.getSource(sourceId).setData(geojsonData);
      // todo: 待确认，是否需要重新addLayer
    } else {
      map.addSource(sourceId, {
        type: 'geojson',
        data: geojsonData
      });
    }
    // 画出边框
    map.addLayer({
      id: 'area',
      // 图层类型
      type: 'fill',
      // 数据源
      source: sourceId,
      paint: {
        'fill-color': regionLineColor,
        'fill-opacity': 0.15
      },
      // layout: { visibility: 'none' },
    },)
    map.addLayer({
      id: 'line',
      // 图层类型
      type: 'line',
      // 数据源
      source: sourceId,
      paint: {
        'line-color': regionLineColor,
        'line-width': 8,
        'line-opacity': 1
      },
      // layout: { visibility: 'none' },
    },)
  };
  const addStreetData = () => {
    const streetLineColor = theme === 'white' ?  '#4670AF' : '#608FD5';
    if (map.getSource('street-markers-source')) {
      map.getSource('street-markers-source').setData(beijingStreet);
    } else {
      map.addSource('street-markers-source', {
        type: 'geojson',
        data: beijingStreet
      });
    }
    // 绘制街道区域的layer
    // 画出边框
    map.getLayer('street-line-layer') && map.removeLayer('street-line-layer');
    map.addLayer({
      id: 'street-line-layer',
      // 图层类型
      type: 'line',
      // 数据源
      source: 'street-markers-source',
      paint: {
        'line-color': [
          "interpolate", ["linear"], ["zoom"],
          9, 'transparent',
          10, streetLineColor
        ],
        'line-width': [
          "interpolate", ["linear"], ["zoom"],
          5, 1,
          10, 3,
          15, 4
        ],
      }
    });
    map.addLayer({
      id: 'street-text-layer',
      // 图层类型
      type: 'symbol',
      // 数据源
      source: 'street-markers-source',
      layout: {
        'text-field': ['get', 'name'],
        'text-size': 14,
      },
      paint: {
        // 'text-color': streetLineColor,
        'text-color':[
          "interpolate", ["linear"], ["zoom"],
          11, 'transparent',
          12, streetLineColor
        ]
      }
    });
    map.moveLayer('street-area-layer','street-line-layer');
  }
  // 初始化数据
  const addSourceAndLayer = () => {
    if(includeAllProvince){
      addAllProvinceData()
    }else{
      addBeijingData();
      addStreetData();
      addDistrictLayer();  
    }
    // todo 待寻找为什么source和layer加载完成后会出现消失的情况，暂时用这种方式弥补下
    setTimeout(()=>{
      if(includeAllProvince){
        addAllProvinceData()
      } else {
        if (!map.getSource('beijing-source')){
          addBeijingData();
        }
        if(!map.getSource(sourceId)){
          addDistrictLayer();
        }
        if(!map.getSource('street-line-layer')){
          addStreetData();
        }
      }
    },500)
  }

  useEffect(()=>{
    addSourceAndLayer()
  },[])
  useEffect(()=>{
    if(map && includeAllProvince){
      addAllProvinceData();
    }
    return () => {
      map.getLayer('china-line') && map.removeLayer('china-line');
    }
  },[includeAllProvince])
  
  useEffect(()=>{
    map.off('style.load',addSourceAndLayer);
    map.once('style.load', addSourceAndLayer);
    return(()=>{
      map.off('style.load',addSourceAndLayer)
    })
  },[theme])

  useEffect(()=>{
    if(!map)return;
    addDistrictLayer();
    // console.log('RegionLayer easeTo',zoom, centerCoords);
    if(activeMarkerInfo && curRegion && activeMarkerInfo.area !== curRegion){
      setIsClickedPicture(false)
      setActiveMarkerInfo()
    }
    if(centerCoords){
      map.easeTo({center:centerCoords,zoom})
    }
  },[curRegion,centerCoords]);
  return <div></div>;
};

export default observer(RegionLayer);
