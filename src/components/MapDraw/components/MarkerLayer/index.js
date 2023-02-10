/* eslint-disable */
import React, { useEffect, useRef, useState } from 'react';
import { toJS } from 'mobx';

const MarkerLayer = ({
  data,
  map,
  iconMap,
  transformData,
  setActiveMarkerInfo,
  theme = 'white' ,
}) => {
  window.map = map;
  const [isClickMap,setIsClickMap] = useState();
  const [isClickMarker,setIsClickMarker] = useState();

  // 数据转为geojson格式
  const transfer = (list = []) => {
    if (!list.length) {
      return {
        type: 'FeatureCollection',
        features: [],
      };
    }
    return {
      type: 'FeatureCollection',
      features: list.map((i) => ({
        type: 'Feature',
        properties: {
          ...i,
          id: i.id || _.uniqueId('id-default'),
        },
        geometry: {
          type: 'Point',
          coordinates: [+i.lng, +i.lat],
        },
      })),
    };
  };

  const sourceId = `point-markers-source`;
  const markerLayers = [`${sourceId}-icon`];
  const addMarkerSource = () => {
    transformData(data);
    const geojsonData = transfer(data);
    if (map.getSource(sourceId)) {
      map.getSource(sourceId).setData(geojsonData);
    } else {
      map.addSource(sourceId, {
        type: 'geojson',
        data: geojsonData,
      });
    }
  };

  const addMarkersLayer = () => {
    // 非聚合-大于10级以后 - icon图层
    let textField = '';
    let textOffset = [0,0];
    let textFont = 0;
    const textColor = theme === 'white' ? 'black' : 'white'
    // textField = ['get', 'address']
    textOffset = [0,-2.8]
    textFont = 14

    map.addLayer({
      id: `${sourceId}-icon`,
      type: 'symbol',
      source: sourceId,
      // filter: ['!', ['has', 'point_count']],
      layout: {
        'icon-image': ['get', 'iconType'],
        'icon-size': 0.5,
        'icon-anchor': 'center',
        'icon-allow-overlap': true,
        // 'text-field': ['get', 'name'],
        // 'text-field': textField,
        // 'text-size': textFont,
        // 'text-offset': textOffset,
      },
      // paint: {
      //   'text-color': textColor,
      // },
      // minzoom: 10, // 小于10级不显示
    });
  };

  // 加载立标icon的图片
  // eslint-disable-next-line no-shadow
  const loadMultiImg = ({ map, imgList }) => {
    if (!map) return;
    return Promise.all(
      imgList.map(
        (img) =>
          new Promise((resolve) => {
            if (map.hasImage(img.id)) return resolve();

            map.loadImage(img.url, (error, res) => {
              if (error) throw error;
              map.addImage(img.id, res);
              resolve();
            });
          }),
      ),
    );
  };

  // 判断坐标是否合法
  const isLngLat = (lng = 0, lat = 0) =>
    lat !== null &&
    lng !== null &&
    Number(lng) &&
    Math.abs(Number(lng)) > 0 &&
    Math.abs(Number(lng)) < 180 &&
    Number(lat) &&
    Math.abs(Number(lat)) > 0 &&
    Math.abs(Number(lat)) < 90;

  // marker 点击操作
  const markerClickAction = async (properties) => {
    const { id: markerId, infoList = [], iconType, layerId, lng, lat, center = '', popupType,showPopup,idx } = properties;

    // marker不存在
    if (!markerId && !lng && !lat){
      setActiveMarkerInfo();
      return ;
    }
    
    // 定位到中心点
    isLngLat(lng, lat) && map.easeTo({ center: [+lng, +lat] });

    // 存在marker 并且 需要popup时执行
    if(markerId){
      setActiveMarkerInfo({
        ...properties,
        infoList
      });
    }
  };

  // 处理marker点击事件
  const handleMarkerClick = (e) => {
    const { features } = e;
    try {
      markerClickAction({
        ...features[0].properties,
        infoList: JSON.parse(features[0].properties.infoList || '{}'),
        layerId: features[0].layer.id,
      });
    } catch (error) {
    }
  };

  // 添加marker的点击监听事件
  const addMarkersListener = () => {
    // 关闭popup的时候，显示所有的 marker
    const onShowMarker = () => {
      markerLayers.forEach((j) => {
        map.setFilter(j, ['all']);
      });
    };

    markerLayers.forEach((layer) => {
      map.on('click', layer, handleMarkerClick);
    });
  };

  // 加载底图的source和layer
  const loadSourceAndLayer = () => {
    loadMultiImg({
      map,
      imgList: Object.keys(iconMap).map((i) => ({ id: i, url: iconMap[i] })),
    }).then(() => {
      addMarkerSource(); // 添加数据
      // addBg(); //添加黄色底图
      addMarkersLayer(); // 添加图层
      addMarkersListener(); // 添加图层点击事件
    });
  }

  // 移除marker监听事件
  const removeMarkersListener = () => {
    markerLayers.forEach((layer) => {
      map.off('click', layer, handleMarkerClick);
    });
  };

  useEffect(() => {
    if (!map) return;
    loadSourceAndLayer();
    
    // 判断是不是点击的底图
    const judgeClick = (e) => {
      const features = map.queryRenderedFeatures(e.point,{ layers: [`${sourceId}-icon`] })
      if(features.length>0){
        setIsClickMarker(true);
        setIsClickMap(false);
      }else{
        setIsClickMap(true);
        setIsClickMarker(false);
      }
    }
    map.on('click',judgeClick)

    return () => {
      map.off('click',judgeClick);
      setActiveMarkerInfo();
      removeMarkersListener(); // 移除图层点击事件
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, data, iconMap]);

  useEffect(()=>{
    if(isClickMap){
      setActiveMarkerInfo();
    }
  },[isClickMap])

  return null
};

export default MarkerLayer;