/* eslint-disable */
/* eslint-disable no-param-reassign */
import { useEffect, useState, useRef, useMemo } from 'react';
import _, { transform } from 'lodash';
import { Popup, Marker } from '@/components/DmapglMap'; 
import { useStore } from '@/hooks';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import { isLngLat } from '@/utils/util';
import styles from './index.module.less';

function MarkerLayer({
  data,
  map,
  updateCenter,
  onClickMarker,
  type = 'jd',
  iconMap,
  transformData,
  addIcon,
  renderPopup,
  zoom = 12,
  minZoom = 8,
  center = [116.38, 39.9],
  seletedData
}) {
  const { activeMarkerInfo, setActiveMarkerInfo,theme } = useStore('gis');
  const { setCurRegion } = useStore('gis');
  const { searchResult, curRegion, setIsClickedPicture, isClickedPicture, setShowTracksTable } = useStore('gis');
  const [areaCenter, setAreaCenter] = useState();
  console.log(toJS(data),'data++++')
  // const [isClickMap,setIsClickMap] = useState()
  const isClickMap = useRef()
  // const [isClickMarker,setIsClickMarker] = useState()
  const isClickMarker = useRef()
  // window.map =  window.dmapgl.map;//map;
  window.map = map;
  if(!data || toJS(data) === {}){
    return null
  }
  let { markerData = [], zoneData } = data;

  // todo:此块数据处理需要让外部来做
  markerData.forEach(i=>{
    const {type} = i
    if(type === '冷链卡口'){
      i.labelContent = i.checkpointName
    }else if(type === '高速收费站'){
      i.labelContent = i.tollGateName
    }
  })


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

  const sourceId = `point-markers-source`;
  const addMarkerSource = () => {
    const clusterProps = {
      cluster: false,
      clusterRadius: 100,
      clusterMaxZoom: 10,
    };
    // console.log(markerData,'markerData1')
    transformData(markerData);
    // console.log(markerData,'markerData2')
    // console.log(markerData,'markerData')
    const geojsonData = transfer(markerData);
    if (map.getSource(sourceId)) {
      map.getSource(sourceId).setData(geojsonData);
      // todo: 待确认，是否需要重新addLayer
    } else {
      map.addSource(sourceId, {
        type: 'geojson',
        data: geojsonData,
        ...clusterProps,
      });
    }
  };
  const clusterLayers = [`${sourceId}-clusters-circle`, `${sourceId}-clusters-count`];

  const addClusterLayer = () => {
    const clusterBgColor = theme === 'white' ? 'rgb(2,135,136)' : '#01D7E4';
    const clusterOpacity = theme === 'white' ? 0.8 : 0.2;
    const clusterStrokeColor = theme === 'white' ? 'rgb(24,128,81)' : 'rgba(3,240,255,0.4)';
    const clusterTextColor = theme === 'white' ? 'white' : 'white';
    map.addLayer({
      id: clusterLayers[0],
      type: 'circle',
      source: sourceId,
      filter: ['has', 'point_count'],
      paint: {
        // 'circle-color': 'rgba(32, 90, 239, 0.85)', // todo
        'circle-color': clusterBgColor, // todo
        'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 300, 40],
        'circle-stroke-width': 2,
        'circle-opacity': clusterOpacity,
        'circle-stroke-color': clusterStrokeColor, // todo
      },
    });
    map.addLayer({
      id: clusterLayers[1],
      type: 'symbol',
      source: sourceId,
      filter: ['has', 'point_count'],
      layout: {
        'text-field': '{point_count_abbreviated}',
        // 'text-font': ['literal', ['msyh']],
        // 'text-font': ['literal', ['msyh']],
        // 'text-font': ['literal'],
        'text-font': ['Microsoft YaHei Bold'],
        'text-size': 22,
      },
      paint: {
        'text-halo-color': clusterTextColor,
        'text-color': clusterTextColor,
      },
    });
  };
 

  const addMarkersLayer = () => {
    // 非聚合-大于10级以后 - icon图层
    let textField = '';
    let textOffset = [0,0];
    let textFont = 0;
    const textColor = theme === 'white' ? 'black' : 'white'
    // todo:之后重构
    textField = ['get', 'labelContent']
    textOffset = [0,-2.8]
    textFont = 14

    map.addLayer({
      // id: `${sourceId}-icon`,
      id: `${type}-markers-icon`,
      type: 'symbol',
      source: sourceId,
      // filter: ['!', ['has', 'point_count']],
      layout: {
        'icon-image': ['get', 'iconType'],
        'icon-size': 0.6,
        'icon-anchor': 'center',
        'icon-allow-overlap': true,
        // 'text-field': ['get', 'iconNum'],
        'text-field': textField,
        'text-size': textFont,
        'text-offset': textOffset,
      },
      paint: {
        'text-color': textColor,
      },
      // minzoom: 10, // 小于10级不显示
    });
    map.moveLayer('区界',`${type}-markers-icon`)
  };
  const addZoneMarkerData = () => {
    const data = seletedData
    if (!data 
      || toJS(data) === {} 
          || (toJS(data).sealingType && (!toJS(data).polygon || toJS(data).polygon == 'null'))){
      map.getLayer('zone-line-layer') && map.removeLayer('zone-line-layer');
      map.getLayer('zone-area-layer') && map.removeLayer('zone-area-layer');
      return;
    };
    // 非封管控小区不处理面数据
    if (!toJS(data).sealingType){ 
      return;
    }
    
    // console.log('addZoneMarkerData', activeMarkerInfo)
    if (map.getSource('zone-markers-source')) {
      // console.log('activeMarkerInfo.polygon', toJS(activeMarkerInfo.polygon));
      map.getSource('zone-markers-source').setData(toJS(data.polygon));
      // console.log('zone-markers-source', map.getSource('zone-markers-source'));
      // todo: 待确认，是否需要重新addLayer
    } else {
      map.addSource('zone-markers-source', {
        type: 'geojson',
        data: toJS(data.polygon),
      });
    }
    
    // 绘制风控区域的layer
    // const regionColor = (data.type === '管控区' ? 'yellow' : (data.type === '封控区' ? 'red' : '#01D7E4'));
    // 画出边框
    const zoneLineColor = theme === 'white' ? '#0673A2' : '#15B1F4';
    const opacity = theme === 'white' ? 0.32 : 0.2;
    map.addLayer({
      id: 'zone-line-layer',
      // 图层类型
      type: 'line',
      // 数据源
      source: 'zone-markers-source',
      paint: {
        'line-color': zoneLineColor,
        'line-width': 6,
        'line-opacity': 1,
        "line-dasharray": [2, 1]
      }
    });
    map.addLayer({
      id: 'zone-area-layer',
      // 图层类型
      type: 'fill',
      // 数据源
      source: 'zone-markers-source',
      paint: {
        'fill-color': '#009EE2',
        'fill-opacity': opacity,
      }
    });
    map.moveLayer('zone-area-layer',`${type}-markers-icon`)
    // console.log('zone-layer', map.getLayer('zone-line-layer'), map.getSource('zone-markers-source'));
  }

  const addClusterListener = () => {
    map.on('click', clusterLayers[0], (e) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: [clusterLayers[0]],
      });
      const clusterId = features[0].properties.cluster_id;
      map.getSource(sourceId).getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) return;

        map.easeTo({
          center: features[0].geometry.coordinates,
          zoom,
        });
      });
    });
  };

  const markerLayers = [`${type}-markers-point`, `${type}-markers-icon`];

  // marker 点击操作
  const markerClickAction = (properties) => {
    const { id: markerId, infoList = [], iconType, layerId, lng, lat, center = '', popupType,showPopup } = properties;
    console.log('markerClickAction', properties);
    // marker不存在
    if (!markerId && !lng && !lat){
      console.log('点击地图事件！！！');
      setActiveMarkerInfo();
      return ;
    }

    // console.log(properties, 'iconType');
    if (popupType === 3 || popupType === 4) {
      setShowTracksTable(true);
    }
    if (center.length !== 0) {
      const centerArray = center.replace(/\[/i, '').replace(/\]/i, '').split(',');
      centerArray?.[0] && centerArray?.[1] && map.easeTo({ center: [+centerArray[0], +centerArray[1]] });
      setAreaCenter([+centerArray[0], +centerArray[1]]);
      setActiveMarkerInfo({
        ...properties,
        infoList,
      });
      setIsClickedPicture(false);
      return;
    }
    isLngLat(lng, lat) && map.easeTo({ center: [+lng, +lat] });
    onClickMarker && onClickMarker(properties);

    let iconFile;
    if (iconType?.includes('blue')) {
      let newIconName = iconType.replace(/blue/i, 'green');
      iconFile = require(`../../assets/${newIconName}.png`);
      // 当点击marker后让此marker消失
      // markerLayers.forEach(i => {
      //   if (layerId === `${sourceId}-icon`) {
      //     map.setFilter(i, [
      //       'all',
      //       ['!=', 'id', markerId],
      //     ]);
      //   }
      // });
    }
    // 存在marker 并且 需要popup时执行
    if(markerId && showPopup!== 'false'){
      setActiveMarkerInfo({
        ...properties,
        infoList,
        icon: layerId === `${sourceId}-icon` && iconType.includes('blue') ? iconFile : null, // todo
        // icon: iconMap.carIcon
      });
    }
    setIsClickedPicture(false);
  };

  const handleMarkerClick = (e) => {
    const { features } = e;
    try {
      // map.getLayer('zone-line-layer') && map.removeLayer('zone-line-layer');
      markerClickAction({
        ...features[0].properties,
        infoList: JSON.parse(features[0].properties.infoList || '{}'),
        layerId: features[0].layer.id,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const removeMarkersListener = () => {
    markerLayers.forEach((layer) => {
      map.off('click', layer, handleMarkerClick);
    });
    // map.getLayer('zone-line-layer') && map.off('click', 'zone-line-layer', handleMarkerClick);
    // window.eventBus.unsubscribe('popup-close');
    // window.eventBus.unsubscribe(`${type}-marker-selected`);
  };

  const removeClusterListener = () => {
    map.off('click', clusterLayers[0]);
  };

  const removeLayers = () => {
    [...clusterLayers, ...markerLayers, 'zone-line-layer'].forEach((layer) => {
      map.getLayer(layer) && map.removeLayer(layer);
    });
  };

  const addMarkersListener = () => {
    // 关闭popup的时候，显示所有的 marker
    const onShowMarker = () => {
      markerLayers.forEach((j) => {
        map.setFilter(j, ['all']);
      });
    };

    // window.eventBus.subscribe('popup-close', onShowMarker);
    markerLayers.forEach((layer) => {
      map.on('click', layer, handleMarkerClick);
    });
    // map.getLayer('zone-line-layer') && map.on('click', 'zone-line-layer', handleMarkerClick);
  };

  const addZoneLayer = () => {
    // map.getLayer('zone-line-layer') && map.removeLayer('zone-line-layer');
    // const data = toJS(activeMarkerInfo);
    addZoneMarkerData();
  }

  // 加载底图的source和layer
  const loadSourceAndLayer = () => {
    loadMultiImg({
      map,
      imgList: Object.keys(iconMap).map((i) => ({ id: i, url: iconMap[i] })),
    }).then(() => {
      addMarkerSource(); // 添加数据
      addMarkersLayer(); // 添加图层
      addClusterLayer(); // 添加聚合图层
      addZoneLayer();
      addMarkersListener(); // 添加图层点击事件
      addClusterListener(); // 添加聚合图层点击监听
    });
  }
  // 监听选中marker,为marker添加边线,选中marker没有polygon属性时删除边线层
  useEffect(() => {
    addZoneLayer();
  }, [seletedData]);
  // 监听地图放大缩小
  useEffect(() => {
    if (!map) return;
    setActiveMarkerInfo();
    // map.setMinZoom(minZoom)
    // map.setZoom(zoom)
    // map.setCenter(center)
    loadSourceAndLayer();
    return () => {
      // console.log('marker useEffect setActiveMarkerInfo null');
      removeMarkersListener(); // 移除图层点击事件
      removeClusterListener();
      // setActiveMarkerInfo(); // 每次重新渲染都执行这个方法，不应该重置activeMarker
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, data?.markerData?.length, data?.zoneData?.length, curRegion]);
  
  useEffect(()=>{
    //当底图风格发生改变的时候触发重新加载图层（底图风格改变，mapbox会自动删掉之前图层）
    map.off('style.load',loadSourceAndLayer);
    map.on('style.load',loadSourceAndLayer);
    return(()=>{
      map.off('style.load',loadSourceAndLayer);
    })
  },[theme])

  useEffect(() => {
    if (!map) return;
    // console.log('useEffect map');
    map.setMinZoom(minZoom);
    const judgeClick = (e) => {
      const features = map.queryRenderedFeatures(e.point,{ layers: ['undefined-markers-icon',`${sourceId}-clusters-circle`, `${sourceId}-clusters-count`] })
      // console.log(features,'features')
      // console.log('map click', features);
      if(features.length>0){
        isClickMarker.current = true
        isClickMap.current = false
        // setIsClickMarker(true)
        // setIsClickMap(false)
      }else{
        isClickMap.current = true
        isClickMarker.current = false
        // setIsClickMap(true)
        // setIsClickMarker(false)
      }
    }
    map.on('click',judgeClick)
    return () => {
      // console.log('MarkerLayer map return');
      setActiveMarkerInfo(); // 地图组件重新渲染时，页面切换，清空选中marker
      setCurRegion(sessionStorage.getItem('area') || '北京');
      map.off('click',judgeClick)
    };
  }, [map]);

  useEffect(() => {
    if (!map || zoom == 0) return;
    // console.log('useEffect zoom', zoom);
    map.setZoom(zoom);
  }, [map, zoom]);

  useEffect(() => {
    if (!map) return;
    // console.log('useEffect updateCenter');
    if(updateCenter){
      map.setCenter(center);
    }
  }, [map,updateCenter]);

  useEffect(
    () => () => {
      // console.log('useEffect init');
      removeLayers();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [],
  );

  useEffect(() => {
    if (Object.keys(searchResult).length === 0 && !map) return;
    // markerClickAction(searchResult) // todo 必须确认layerID
  }, [searchResult]);

  if (!activeMarkerInfo) return null;

  let activeMarkerCoord;
  if (areaCenter) {
    activeMarkerCoord = areaCenter;
  } else {
    activeMarkerCoord = activeMarkerInfo && [+activeMarkerInfo.lng, +activeMarkerInfo.lat];
    if (activeMarkerCoord && map) {
      map.easeTo({ center: activeMarkerCoord, zoom: 13 });
    }
  }

  addIcon(activeMarkerInfo);
  let { icon = '', popupType } = activeMarkerInfo || {};
  let newIconName;
  const { iconType } = activeMarkerInfo;
  if (iconType?.includes('blue')) {
    newIconName = iconType.replace(/blue/i, 'green');
    icon = require(`../../assets/${newIconName}.png`);
  }
  // console.log(icon, 'icon');
  const onPopupClose = (e) => {
    console.log('onPopupClose', e);
    // console.log(isClickMap, 'isClickMap');
    // console.log(isClickMarker, 'isClickMap--');
    // console.log(activeMarkerInfo,'activeMarkerInfo')

    // if (activeMarkerId === activeMarkerInfo.markerId) {
    //   setActiveMarkerInfo();
    //   return;
    // }
    // if (activeMarkerId){
    //   return;
    // }
    // if (newIconName?.includes('green') && !isClickedPicture) {
    //   icon = '';
    // }
    // if(isClickMap.current){
      // console.log('onPopupClose isClickMap true');
      // setIsClickedPicture(false)
      // setActiveMarkerInfo();
      // setShowTracksTable(false);
      // setIsClickMap(false)
      // return
    // }
    // if(isClickMarker.current){
    //   // console.log('onPopupClose isClickMarker true');
    //   isClickMarker.current = null;
    //   // setIsClickedPicture(true);
    //   // setIsClickMarker(false)
    //   // setActiveMarkerInfo();
    //   return
    // }
    // if (isClickedPicture) {
    //   // console.log('onPopupClose isClickedPicture true');
    //   // setIsClickedPicture(true); // 已经是true了， 为什么还set
    //   setAreaCenter();
    // } else {
    //   // console.log('onPopupClose isClickedPicture false');
    //   setActiveMarkerInfo();
    //   setShowTracksTable(false);
    // }
  };

  // const {markerData} = data
  //  ;
  // const curRegionData = markerData.filter(i=>i.area === curRegion) || []
  // const curRegionDataIds = curRegionData.map(i=>i.markerId) || []
  // console.log(curRegionDataIds,'curRegionDataIds')
  // curRegionDataIds.forEach(i=>{
  //   map.setFilter(`${type}-markers-icon`, [
  //     'all',
  //     ['!=', 'id', i],
  //   ]);
  // })

  // console.log(activeMarkerInfo,'activeMarkerInfo')

  return (
    <>
      {icon && (
        <Marker map={map} defaultSize={[12, 12]} activeSize={[12, 12]} LngLat={activeMarkerCoord} anchor='center'>
          <img
            src={icon}
            alt='立标'
            style={{ transform: 'scale(0.6)' }}
            onClick={(e) => {
              setActiveMarkerInfo();
            }}
          />
        </Marker>
      )}
      {map &&
        activeMarkerInfo &&
        (activeMarkerInfo.showPopup === 'false' ? (
          ''
        ) : (
          <div className={styles['popup-wrapper']}>
            <Popup
              key={Math.random()}
              className={styles['popup-wrapper']}
              html={renderPopup(activeMarkerInfo)}
              // closeButton={(popupType === 4 || popupType === 3 || popupType === 6) ? false : true}
              closeButton={(popupType === 3) ? false : true}
              LngLat={activeMarkerCoord}
              // LngLat = {[116.38, 39.9]}
              anchor={(popupType === 4 || popupType === 6) ? 'bottom' : 'top-left'}
              offset={(popupType === 4 || popupType === 6) ? [0, -13] : popupType === 5 ? [45, -5] : [25, -5]}
              close={(e) => onPopupClose(e)}
              // offset={[
              //   iconWidth * (window.innerWidth / 3360) * (iconWidthOffsetRate || 0.6),
              //   iconHeight * (window.innerWidth / 3360) * (-iconHeightOffsetRate || -0.67),
              // ]}
            />
          </div>
        ))}
    </>
  );
}

export default observer(MarkerLayer);
