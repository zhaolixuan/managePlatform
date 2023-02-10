/* eslint-disable */
import React, { useEffect, useState } from 'react';
import ReactJson from 'react-json-view';
import { Modal, Button, message, Spin } from '@jd/find-react';
import * as turf from '@turf/turf';
import { toJS } from 'mobx';
import SelectPoi from './components/SelectPoi';
import SearchPoi from './components/SearchPoi';
import BaseMap from '@/components/GisMap/components/BaseMap';
import Marker from '@/components/DmapglMap/Marker';
import DrawPopup from './components/DrawPopup';
import MarkerPopup from './components/MarkerPopup';
import MapTool from './components/MapTool';
import FullScreen from './components/FullScreen';
import MarkerLayer from './components/MarkerLayer';
import { lightConfig, darkConfig } from './utils/mapConfig';
import styles from './index.module.less';

/**
 *
 * @param {Boolean} visible  当前Modal是否可见
 * @param {String} theme  当前地图的主题
 * @param {String} scale  当前组件的缩放比例，可能需配合showModal字段使用
 * @param {Object} mapData  后端返回的数据，包含经纬度和id
 * @param {Function} saveDrawData  报错所画的数据
 * @param {Function} poiSearch  经信局反差经纬度的函数
 * @param {Boolean} drawAreaTabStatus  是否开启右侧面坐标的tab
 * @param {Boolean} drawPointTabStatus  是否开启右侧点坐标的tab
 * @param {Boolean} drawPolygonStatus  是否开启画多边形的功能
 * @param {Boolean} drawPointTabStatus  是否开启画点的功能
 * @param {Boolean} markerLayerStatus  是否开启地图上显示markerLayer的功能
 * @param {Boolean} markerData  markerLayer中marker点的数据
 * @param {Boolean} showModal  是否为弹窗
 * @param {Array} typeList  markerLayer中type及其对应的icon的关系表
 * @param {Array} markerData  markerLayer中marker点的数据
 * @returns
 */

const MapDraw = ({
  visible,
  setVisible,
  theme = 'white',
  scale,
  mapData = {},
  saveDrawData,
  poiSearch,
  drawAreaTabStatus,
  drawPointTabStatus,
  drawPolygonStatus,
  drawPointStatus,
  markerLayerStatus,
  showModal,
  typeList,
  markerData,
  setLnglat,
  showSaveButton = true,
  showHeader = true,
  allowFirstSearch = true,
  spinStatus = false,
  handleCancel
}) => {
  const mapStyle = {
    width: '100%',
    height: '100%',
  };
  theme = 'white'; // 根据业务需求，暂时写死为白色
  const { liveName = '', latitude = '', longitude = '', id = '', polygon = '', address = '' } = mapData;
  const [addMarkerStatus, setAddMarkerStatus] = useState(false);
  const [areaGeojsonData, setAreaGeojsonData] = useState({});
  const [pointGeojsonData, setPointGeojsonData] = useState({});
  const [popupStatus, setPopupStatus] = useState(false); // draw 的popup
  const [markerPopupStatus, setMarkerPopupStatus] = useState(false); // draw 的popup
  const [curDrawId, setCurDrawId] = useState();
  const [curSearchCoord, setCurCoord] = useState([]); // 搜索得到点的坐标
  const [isFirstSearch, setIsFirstSearch] = useState(false); // 是否是第一次搜索
  const [tab, setTab] = useState(1);
  const handleOk = () => { };
  const [mapInstance, setMapInstance] = useState();
  const [markerCoord, setMarkerCoord] = useState([]); // marker点的坐标
  const [popupCenter, setPopupCenter] = useState([]);
  const [multiPolygonCenter, setMultiPolygonCenter] = useState([]); // 多个多边形的中心点
  const [fullScreen, setFullScreen] = useState(false);
  const [iconMap, setIconMap] = useState({}); // marker点的对应icon关系
  const [allTypes, setAllTypes] = useState({}); // marker点所有的types
  const [activeMarkerInfo, setActiveMarkerInfo] = useState(); // 激活点的popup
  const [searched,setSearched] = useState(false); // 是否搜索过，通过这个字段来判断快速打点工具是否可以使用
  const [quickAddMarkerStatus,setQuickAddMarkerStatus] = useState(false); // 是否快速打点
  const [curDrawMpde,setCurDrawMpde] = useState(); // 当前绘制模式，防止快速打点和绘制多边形冲突

  // 调用turf计算中心店
  const getCenter = (data) => {
    const center = turf.center(data).geometry.coordinates; // turf 计算中心点
    const formatCenter = center.map((i) => {
      return +i.toFixed(6);
    });
    return formatCenter;
  };

  // 若用户在地图上画多个区，需计算多个区中心点的中心
  const getMultiDrawCenter = () => {
    const areaFeatures = areaGeojsonData?.features?.filter((i) => i?.geometry?.type !== 'Point');
    const centers = areaFeatures.map((i) => {
      return getCenter(i);
    });
    if (centers.length > 1) {
      const center = getCenter({
        id: 'center',
        type: 'Feature',
        properties: {},
        geometry: {
          coordinates: [centers],
          type: 'Polygon',
        },
      });
      setMultiPolygonCenter(center);
      return center;
    } else {
      setMultiPolygonCenter(centers[0]);
      return centers[0];
    }
  };

  // 保存数据的处理函数
  const handleSave = async () => {
    if (Object.keys(areaGeojsonData).length === 0 && Object.keys(pointGeojsonData).length === 0) {
      // message.error('没有数据可提交')
    }
    let formatDataJson = {
      id,
      latitude: '',
      longitude: '',
      polygon: '',
    };
    if (Object.keys(areaGeojsonData).length > 0 && areaGeojsonData.features.length > 0) {
      const multiPolygonCenters = getMultiDrawCenter();

      formatDataJson = {
        id,
        latitude: multiPolygonCenters[1] || '',
        longitude: multiPolygonCenters[0] || '',
        polygon: JSON.stringify(areaGeojsonData) || '',
      };
    } else if (Object.keys(pointGeojsonData).length > 0 && pointGeojsonData.features.length > 0) {
      formatDataJson = {
        id,
        latitude: pointGeojsonData.features[0].geometry.coordinates[1] || '',
        longitude: pointGeojsonData.features[0].geometry.coordinates[0] || '',
        polygon: '',
      };
    }
    if (!saveDrawData) return;
    saveDrawData({mapData, ...formatDataJson});  // 将请求的param传给父组件，由父组件来调接口
  };

  // 地图加载完成后的回调
  const onMapLoad = async (e) => {
    setMapInstance(e.target);
    window.map = e.target;
    if (!poiSearch || !allowFirstSearch) return;
    // if (!longitude) {
    // 初次进入执行搜索，地址优先于名称
    const res = await poiSearch({
      method: 'get',
      path:"/jinxin/icity-support-screen/AddrCode/cmd",
      param:{"address": address || liveName,"output":"JSON","batch":"true","coord":"cgcs2000","adcode":"yes"}
    });
    setSearched(true);
    setIsFirstSearch(true);
    if (res.length === 0) {
      message.error(`未查询到该地址: ${address || liveName}`);
      map.easeTo({ center: [116.38, 40.245999] });
      return;
    }
    const { location } = res[0];
    const lng = +location.split(',')[0].replace('"', '');
    const lat = +location.split(',')[1].replace('"', '');
    map.easeTo({ center: [lng, lat] });
    setCurCoord([lng, lat]);
    if (setLnglat) {
      setLnglat({ latitude: `${lat}`, longitude: `${lng}` })
    }
    // }
  };

  // 更换点坐标和面坐标tab页
  const changeTab = () => {
    if (tab === 1) {
      setTab(2);
    } else {
      setTab(1);
    }
  };

  // 全屏工具接受的额外处理函数：主要是为了让地图canvas等比放大（此法不可行）
  const extraFunction = () => {
    // 使用mapbox的原生方法实现
    mapInstance.resize();
    // 以下方法不可行，废弃
    // let mapCanvasWidth = window.document.getElementsByClassName('mapboxgl-canvas')[0].offsetWidth;
    // let mapCanvasHeight = window.document.getElementsByClassName('mapboxgl-canvas')[0].offsetHeight;
    // let leftZoneWidth = window.document.getElementById('map-left-zone').offsetWidth;
    // let rate = leftZoneWidth / mapCanvasWidth;
    // const zoomUpMapCanvsHeight = mapCanvasHeight * rate;
    // window.document.getElementsByClassName('mapboxgl-canvas')[0].style.width = `${leftZoneWidth}px`;
    // window.document.getElementsByClassName('mapboxgl-canvas')[0].style.height = `${zoomUpMapCanvsHeight}px`;
  };

  // 转换地图的数据
  const transformData = (data = []) => {
    data.forEach((i, idx) => {
      i.iconType = allTypes[typeList[i.type] + '-icon'];
      i.idx = idx;
    });
  };

  useEffect(() => {
    if (!areaGeojsonData) return;
    // setCenterCoord(getCenter(areaGeojsonData));
  }, [areaGeojsonData]);

  useEffect(() => {
    if (!markerLayerStatus) return;
    // 加在markerLayer所需的icon
    let icons = {};
    let allType = {};
    const context = require.context('@/assets/map',true,/.png$/)
    Object.values(typeList).forEach((i) => {
      allType[`${i}-icon`] = `${i}-icon`;
      const imgName = `${i}-icon`;
      icons[`${i}-icon`] = context(`./${theme}/${imgName}.png`);
    });
    setIconMap(icons);
    setAllTypes(allType);
  }, [mapInstance]);

  const mapContent = (
    <Spin spinning={spinStatus} id='map-draw'>
      <div style={{ transform: `scale(${scale})` }}>
        {showHeader && <div className={styles['header-wrapper']}>
          <div>
            <span>名称：{liveName}</span>
            {address && <span>地址：{address}</span>}
          </div>
          <div className={styles['right-tools']}>
            <div>
              <FullScreen setFullScreen={setFullScreen} fullScreen={fullScreen} extraFunction={extraFunction} />
            </div>
            <div onClick={() => handleCancel && handleCancel()}>X</div>
          </div>
        </div>}
        <div className={styles['content-wrapper']} style={{ height: fullScreen ? 'calc(100vh - 114px)' : '644px' }}>
          <div id='map-left-zone' className={`${styles['left-zone']} ${addMarkerStatus && styles.selecting}`}>
            <SearchPoi
              searchMethod={poiSearch}
              defaultData={liveName}
              style={{ top: '15px', left: '23px', position: 'absolute', zIndex: '1000', width: '300px' }}
              placeholder='请输入地址'
              map={mapInstance}
              setCurCoord={setCurCoord}
              curSearchCoord={curSearchCoord}
              setIsFirstSearch={setIsFirstSearch}
              isFirstSearch={isFirstSearch}
              setSearched={setSearched}
              searched={searched}
              curDrawMpde={curDrawMpde}
              initDrawData={polygon}
              setQuickAddMarkerStatus={setQuickAddMarkerStatus}
              quickAddMarkerStatus={quickAddMarkerStatus}
              pointGeojsonData={pointGeojsonData}
            />
            {/* <SelectPoi searchMethod={poiSearch} defaultData={liveName} style={{ top: '57px', left: '23px', position: 'absolute', zIndex: '1000', width: '300px' }} /> */}
            <BaseMap
              load={onMapLoad}
              mapStyle={mapStyle}
              initialZoom={8}
              initialCenter={longitude ? [+longitude, +latitude] : [116.38, 40.245999]}
              mapConfig={lightConfig.map}
            >
              {/* 暂时关闭场所类型参考点这个功能，在地图上显示会影响正常功能的使用 */}
              {/* {markerLayerStatus && (
                <MarkerLayer
                  data={markerData}
                  map={mapInstance}
                  iconMap={iconMap}
                  transformData={transformData}
                  setActiveMarkerInfo={setActiveMarkerInfo}
                  theme='white'
                />
              )} */}
              <MapTool
                map={mapInstance}
                mapData={mapData}
                addMarkerStatus={addMarkerStatus}
                setAddMarkerStatus={setAddMarkerStatus}
                setAreaGeojsonData={setAreaGeojsonData}
                areaGeojsonData={areaGeojsonData}
                setPointGeojsonData={setPointGeojsonData}
                pointGeojsonData={pointGeojsonData}
                setTab={setTab}
                setPopupStatus={setPopupStatus}
                setCurDrawId={setCurDrawId}
                setPopupCenter={setPopupCenter}
                popupCenter={popupCenter}
                setMultiPolygonCenter={setMultiPolygonCenter}
                setCurDrawMpde={setCurDrawMpde}
                initDrawData={polygon}
                curDrawId={curDrawId}
                setMarkerPopupStatus={setMarkerPopupStatus}
                setMarkerCoord={setMarkerCoord}
                markerCoord={markerCoord}
                setCurCoord={setCurCoord}
                curSearchCoord={curSearchCoord}
                setIsFirstSearch={setIsFirstSearch}
                isFirstSearch={isFirstSearch}
                drawPolygonStatus={drawPolygonStatus}
                drawPointStatus={drawPointStatus}
                setLnglat={setLnglat}
                setSearched={setSearched}
                searched={searched}
                setQuickAddMarkerStatus={setQuickAddMarkerStatus}
                quickAddMarkerStatus={quickAddMarkerStatus}
              />
              {/* {!polygon && longitude ? (
                ''
              ) : (
                <Marker LngLat={[+longitude, +latitude]} map={mapInstance}>
                  <img src={require('./assets/icons/origin-marker-icon.png')} alt='初始点' />
                </Marker>
              )} */}
              {popupStatus && (
                <DrawPopup
                  coord={popupCenter}
                  setPopupStatus={setPopupStatus}
                  areaGeojsonData={areaGeojsonData}
                  setAreaGeojsonData={setAreaGeojsonData}
                  curDrawId={curDrawId}
                />
              )}
              {markerPopupStatus && <MarkerPopup coord={markerCoord} setMarkerPopupStatus={setMarkerPopupStatus} />}
            </BaseMap>
          </div>
          <div className={styles['right-zone']}>
            <div className={styles['header-zone']}>
              <div className={styles['tab-wrapper']}>
                {drawAreaTabStatus && (
                  <div className={`${styles.header} ${tab === 1 && styles.active}`} onClick={changeTab}>
                    <span>面坐标 GeoJson</span>
                  </div>
                )}
                {drawPointTabStatus && (
                  <div className={`${styles.header} ${tab === 2 && styles.active}`} onClick={changeTab}>
                    <span>点坐标 GeoJson</span>
                  </div>
                )}
              </div>
              <div className={styles['split-line']}></div>
            </div>
            <div className={styles['geo-json']} style={{ height: fullScreen ? 'calc(100vh - 180px)' : '550px' }}>
              <ReactJson
                src={tab === 1 ? areaGeojsonData : pointGeojsonData}
                name={false}
                style={{ height: '100%' }}
              ></ReactJson>
            </div>
          </div>
        </div>
        {showSaveButton && <div className={styles['footer-wrapper']}>
          <Button type='default' onClick={() => handleCancel && handleCancel()}>
            取消
          </Button>
          <Button type='primary' onClick={handleSave}>
            确定
          </Button>
        </div>}
      </div>
    </Spin>
  );

  return (
    <>
      {showModal ? (
        <Modal
          visible={visible}
          onOk={handleOk}
          onCancel={() => handleCancel && handleCancel()}
          centered
          closable={false}
          footer={null}
          width={fullScreen ? '100vw' : '1500px'}
          height={fullScreen ? '100vh' : '736px'}
          wrapClassName={styles['modal-wrapper']}
        >
          {mapContent}
        </Modal>
      ) : <div className={styles['modal-wrapper']}> {mapContent}</div>
      }
    </>
  );
};

export default MapDraw;
