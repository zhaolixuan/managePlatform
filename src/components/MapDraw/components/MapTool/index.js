/* eslint-disable */
import React, { useEffect, useRef, useState } from 'react';
import { Button, message, Tooltip } from '@jd/find-react';
import mapboxgl from 'mapbox-gl';
import Draw from '@/components/DmapglMap/Draw';
import * as turf from '@turf/turf';
import { ICONPATH } from './constant';
import styles from './index.module.less';

const {
  normalPolygonIcon,
  activePolygonIcon,
  normalLocationIcon,
  activeLocationIcon,
  normalRectangleIcon,
  activeRectangleIcon,
  beijingCoord,
} = ICONPATH;

/**
 *
 * @param {Object} map  地图实例
 * @param {Object} mapData  后端传过来的数据，包含经纬度和id
 * @param {Object} areaGeojsonData  面坐标的数据
 * @param {Object} initDrawData 初始进入该工具的回显polygon数据,非点数据
 * @param {String} curDrawId 当前被选中的多边形或者点的id
 * @param {Object} curSearchCoord 搜索得到的点
 * @param {Function} setAddMarkerStatus  地图上仅允许添加一个marker
 * @param {Function} setPopupStatus  设置多边形popup的显隐
 * @param {Function} setCurDrawMpde  父组件获取设置当前绘制模式
 * @param {Function} setIsFirstSearch 是不是初次进入，初次进入则调经信局的接口获取经纬度
 * @returns
 */

const MapTool = ({
  map,
  mapData,
  setAddMarkerStatus,
  areaGeojsonData = {},
  setAreaGeojsonData,
  setPointGeojsonData,
  setPopupCenter,
  setMultiPolygonCenter,
  setTab,
  setPopupStatus,
  curDrawId,
  setCurDrawId,
  setCurDrawMpde,
  initDrawData,
  setMarkerPopupStatus,
  setMarkerCoord,
  curSearchCoord,
  setIsFirstSearch,
  isFirstSearch,
  drawPolygonStatus,
  drawPointStatus,
  setLnglat,
  searched,
  setSearched,
  setQuickAddMarkerStatus,
  quickAddMarkerStatus,
}) => {
  const { latitude, longitude, id } = mapData;
  const drawIns = useRef();
  const curMode = useRef('simple_select');
  const drawStatus = useRef(); // 通过这个字段来判断是create还是select
  const [drawToolStatus, setDrawToolStatus] = useState(false);
  const [activeKey, setActiveKey] = useState();
  const [isAddPoint, setIsAddPoint] = useState(); // 判断是不是画点
  const [pointOrDraw, setPointOrDraw] = useState(['point', 'draw']);
  const [addLocationMarkerTimes, setAddLocationMarkerTimes] = useState(0); // 只允许画一个点
  const [defaultData, setDefaultData] = useState({}); // 初始化的数据
  const [curLat, setCurLat] = useState(latitude); // 当前的经度
  const [curLng, setCurLng] = useState(longitude);
  const markerIns = useRef();

  const onLoad = (e) => {
    drawIns.current = e;
    e.changeMode(curMode.current);
  };

  // 使用turf获取中心点
  const getCenter = (data) => {
    const center = turf.center(data).geometry.coordinates; // turf 计算中心点
    const formatCenter = center.map((i) => {
      return +i.toFixed(6);
    });
    return formatCenter;
  };

  // 当draw的数据发生改变时执行此函数
  const updateArea = (e, all) => {
    let centers = [];
    const areaFeatures = all.features.filter((i) => i?.geometry?.type !== 'Point');
    const pointfetures = all.features.filter((i) => i?.geometry?.type === 'Point');
    if (isAddPoint) {
      setTab(2);
    } else {
      setTab(1);
      centers = areaFeatures.map((i) => {
        return getCenter(i);
      });
    }
    const areaGeoJson = {
      type: 'FeatureCollection',
      features: areaFeatures,
      // "centers": centers
    };
    const pointGeoJson = {
      type: 'FeatureCollection',
      features: pointfetures,
    };
    if (centers.length > 1) {
      const multiPolygonCenter = getCenter({
        id: 'center',
        type: 'Feature',
        properties: {},
        geometry: {
          coordinates: [centers],
          type: 'Polygon',
        },
      });
      setMultiPolygonCenter(multiPolygonCenter);
      // 更新当前中心点
      setCurLat(multiPolygonCenter[1]);
      setCurLng(multiPolygonCenter[0]);
    } else {
      setMultiPolygonCenter(centers[0]);
      // 更新当前中心点
      centers[0] && setCurLat(centers[0][1]);
      centers[0] && setCurLng(centers[0][0]);
    }
    setAreaGeojsonData(areaGeoJson);
    setPointGeojsonData(pointGeoJson);
  };

  // 新增一个单点：在绘制的基础上在其点位上多增一个marker点
  const addLocationMarker = (coord) => {
    if (!coord) return;
    const marker = new mapboxgl.Marker({}).setLngLat(coord).addTo(map);
    markerIns.current = marker;
    // addMeasurePointListener(marker);
    const markerGeoJsonData = {
      type: 'Feature',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Point',
            coordinates: coord,
          },
        },
      ],
    };
    setPointGeojsonData({ ...markerGeoJsonData });
    setAddMarkerStatus(false);
    setAddLocationMarkerTimes(1);
    setTab(2);
    if (setLnglat) {
      setLnglat({ latitude: `${coord[1]}`, longitude: `${coord[0]}` });
    }
    // 更新当前点数据
    setCurLat(coord[1]);
    setCurLng(coord[0]);
    // setSearched(false); // 释放搜索状态
  };

  // 更换绘制模式
  const changeMode = (mode) => {
    if (mode === 'draw_polygon') {
      const filteredData = pointOrDraw.filter((i) => i === 'draw');
      setPointOrDraw(filteredData);
      setTab(1);
      // 防止快速打点和多边形绘制冲突
      setCurDrawMpde('draw_polygon');
    } else if (mode === 'draw_point') {
      setTab(2);
    }
    setDrawToolStatus(true);
    setActiveKey(mode);
    curMode.current = mode;
    drawIns.current && drawIns.current.changeMode(mode);
  };

  const deleteDraw = ({ id, areaGeojsonData, setAreaGeojsonData }) => {
    // const filteredFeatures = areaGeojsonData.features.filter(i=>{return i.id !== id})
    let deleteItemIdx;
    let newAreaGeojsonData = areaGeojsonData;
    newAreaGeojsonData.features.forEach((i, idx) => {
      if (i.id === id) {
        deleteItemIdx = idx;
      }
    });
    if (deleteItemIdx || deleteItemIdx === 0) {
      // newAreaGeojsonData.centers.splice(deleteItemIdx,1);
      newAreaGeojsonData.features.splice(deleteItemIdx, 1);
    }
    if (newAreaGeojsonData.features.length === 0) {
      // 不可以重新建一个Draw组件，会发生冲突
      // setDrawToolStatus(false)
      curMode.current = 'simple_select';
      drawIns.current.changeMode('simple_select');
      // 清空当前中心点坐标
      setCurLat();
      setCurLng();
    }
    setAreaGeojsonData({ ...newAreaGeojsonData });
    drawIns.current.delete(id);
    window.eventBus.unsubscribe('delete-draw', deleteDraw);
    
    // 当删除多边形时，动态更新多边形的中心点坐标
    let centers = [];
    centers = newAreaGeojsonData.features.map((i) => {
      return getCenter(i);
    });
    if (centers.length > 1) {
      const multiPolygonCenter = getCenter({
        id: 'center',
        type: 'Feature',
        properties: {},
        geometry: {
          coordinates: [centers],
          type: 'Polygon',
        },
      });
      setMultiPolygonCenter(multiPolygonCenter);
      // 更新当前中心点
      setCurLat(multiPolygonCenter[1]);
      setCurLng(multiPolygonCenter[0]);
    } else {
      setMultiPolygonCenter(centers[0]);
      // 更新当前中心点
      centers[0] && setCurLat(centers[0][1]);
      centers[0] && setCurLng(centers[0][0]);
    }
  };

  // 地图放大
  const zoomUp = () => {
    if (!map) return;
    const curZoom = map.getZoom();
    map.easeTo({
      zoom: curZoom + 1,
      duration: 800,
    });
  };

  // 地图缩小
  const zoomDown = () => {
    if (!map) return;
    const curZoom = map.getZoom();
    map.easeTo({
      zoom: curZoom - 1,
      duration: 800,
    });
  };

  // 删除单点
  const deleteMarker = () => {
    markerIns.current.getElement().removeEventListener('click', handleMarkerClick);
    markerIns.current.remove();
    setPointGeojsonData({});
    setAddLocationMarkerTimes(0);
    setPointOrDraw(['point', 'draw']);
    if (setLnglat) {
      setLnglat({ latitude: '', longitude: '' });
    }
    setQuickAddMarkerStatus(false);
  };

  // 处理单点的点击事件
  const handleMarkerClick = () => {
    setMarkerPopupStatus(true);
    window.eventBus.subscribe('delete-marker', deleteMarker);
  };

  // 当draw的图形被选中
  const select = (e) => {
    if (drawStatus.current === 'create') {
      drawStatus.current = '';
      return;
    }
    const { features } = e;
    if (!features.length) {
      setPopupStatus(false);
      return;
    }
    setCurDrawId(features[0].id);
    setPopupCenter(getCenter(e.features[0]));
    if (curMode.current !== 'draw_point') {
      setPopupStatus(true);
      window.eventBus.subscribe('delete-draw', deleteDraw);
    }
    map.doubleClickZoom.disable();
  };

  // 当初始化创建一个draw图形
  const create = (e) => {
    drawStatus.current = 'create';
    // map.off('draw.create', create);
    // 判断是不是打点
    const { features } = e;
    const coord = features[0].geometry.coordinates;
    if (features[0].geometry.coordinates.length === 2) {
      setIsAddPoint(true);
      addLocationMarker(coord);
      setCurDrawId(features[0].id);
      if (setLnglat) {
        setLnglat({ latitude: `${coord[1]}`, longitude: `${coord[0]}` });
      }
    }
    setActiveKey();
  };

  // 删除一个单点
  const deletePoint = () => {
    deleteMarker();
    // 将当前的经纬度清空
    setCurLat();
    setCurLng();
    if (!drawIns.current) {
      return;
    }
    drawIns.current.delete(curDrawId);
    curMode.current = 'simple_select';
    setIsAddPoint(false);
    setQuickAddMarkerStatus(false);
  };

  useEffect(() => {
    map.on('draw.selectionchange', select);
    map.on('draw.create', create);
    if (initDrawData) {
      try {
        setDefaultData(JSON.parse(initDrawData));
        setAreaGeojsonData(JSON.parse(initDrawData));
        setDrawToolStatus(true);
      } catch {
        message.error('Polygon格式错误');
      }
    } else if (curLat) {
      const coord = [curLng, curLat];
      // addLocationMarker(coord);  // 当一进来要求检索区域，此处不需要开，反之亦然
    }
    return () => {
      setSearched(false); // 释放搜索状态
    };
    // need todo 1.添加marker点的回显 2.point点数据更新
  }, []);

  useEffect(() => {
    // 当后端没有返回回显数据+不是第一次搜索+绘制状态允许   才需要首次进入执行搜索和打点
    if (curSearchCoord.length > 0 && isFirstSearch && drawPointStatus && (!latitude || !longitude)) {
      addLocationMarker(curSearchCoord);
      setIsFirstSearch(false);
    }
  }, [isFirstSearch, curSearchCoord]);

  // 快速打点
  useEffect(() => {
    if (!quickAddMarkerStatus) return;
    addLocationMarker(curSearchCoord);
    setQuickAddMarkerStatus(false);
  }, [quickAddMarkerStatus]);

  // 如果后端只返回了点数据（无面数据polygon），则直接打点，不通过搜索来打点
  useEffect(()=>{
    if(longitude && latitude && !initDrawData){
      addLocationMarker([longitude,latitude])
    }
  },[])

  return (
    <div className={styles['draw-container']}>
      <Tooltip placement='left' title='快速定位到地图单点或者多边形中心处，无点或多边形时不可用'>
        <div>
          <Button disabled={!curLat} className={styles['back-origin-wrapper']}>
            <img
              onClick={() => {
                curLat && map.easeTo({ center: [curLng, curLat], zoom: 10, duration: 1000 });
              }}
              src={require('../../assets/icons/back-to-origin-icon.png')}
              alt='回到起点'
              key='backOrigin'
            />
          </Button>
        </div>
      </Tooltip>
      <div className={styles['zoom-wrapper']}>
        <img onClick={zoomUp} src={require('../../assets/icons/zoom-up-icon.png')} alt='放大' />
        <img onClick={zoomDown} src={require('../../assets/icons/zoom-down-icon.png')} alt='缩小' />
      </div>
      {drawPolygonStatus && (
        <Tooltip placement='left' title='多边形绘图小工具：当地图上没有手动打点时可以使用，地图上支持绘制多个'>
          <div>
            <Button
              disabled={curMode.current === 'draw_point' || addLocationMarkerTimes >= 1}
              className={styles['draw-tool-wrapper']}
            >
              <img
                onClick={() => {
                  changeMode('draw_polygon');
                }}
                src={activeKey === 'draw_polygon' ? activePolygonIcon : normalPolygonIcon}
                alt='多边形'
                key='polygon'
              />
            </Button>
          </div>
        </Tooltip>
      )}
      {/* 正常打点小工具 */}
      {drawPointStatus && (
        <Tooltip
          placement='left'
          title='打点小工具：当地图上没有多边形区域时可以使用，地图上仅支持打一个点，删除请点击下方按钮'
        >
          <div>
            <Button
              disabled={
                curMode.current === 'draw_polygon' ||
                addLocationMarkerTimes >= 1 ||
                areaGeojsonData?.features?.length > 0
              }
              className={styles['location-tool-wrapper']}
            >
              <img
                onClick={() => {
                  changeMode('draw_point');
                  addLocationMarker();
                }}
                src={activeKey === 'draw_point' ? activeLocationIcon : normalLocationIcon}
                alt='点'
                key='point'
              />
            </Button>
          </div>
        </Tooltip>
      )}
      {drawPointStatus && (
        <Tooltip placement='left' title='点击删除地图上的点'>
          <div>
            <Button className={styles['location-tool-wrapper']}>
              <img onClick={deletePoint} src={require('../../assets/icons/delete-icon.png')} alt='删除' />
            </Button>
          </div>
        </Tooltip>
      )}
      {map && drawToolStatus && (
        <Draw
          map={map}
          updateArea={updateArea}
          single={false}
          showControll={false}
          modes={['draw_circle', 'draw_rectangle', 'draw_polygon']}
          initialRadiusInKm={10}
          load={onLoad}
          lineColor='rgba(35,137,255,1)'
          data={defaultData?.features}
        />
      )}
    </div>
  );
};

export default MapTool;
