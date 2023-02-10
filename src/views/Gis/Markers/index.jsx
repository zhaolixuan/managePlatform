/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { useStore } from '@/hooks';
import CommonMap from '@/components/GisMap/components/BaseMap';
import MarkerLayer from './components/MarkerLayer';
import RegionLayer from './components/RegionLayer';
import FlyLine3D from './components/FlyLine';
import PopupContent from './components/PopupContent';
import ZoomMapTool from './components/ZoomMapTool';
import OriginTool from './components/OriginTool';
import CheckboxMapTool from './components/CheckboxMapTool';
import { observer } from 'mobx-react';
import mapboxgl from 'mapbox-gl';
import { Popup, Marker } from '@jd/mapbox-react';
import DrawTool from './components/DrawTool';
import DimensionTool from './components/DimensionTool';
import ThemeTool from './components/ThemeTool';
import 'mapbox-gl/dist/mapbox-gl.css';
import styles from './index.module.less';
import { update } from 'lodash';

/**
 *
 * @param {object} scaleConfig  比例尺的相关配置
 * @param {object} zoomToolConfig  缩放工具的相关配置
 * @param {boolean} originToolConfig 回到地图原点的相关配置
 * @param {boolean} dimensionToolConfig 2D 3D转换按钮
 * @param {array} data  传给地图的数据
 * @param {function} showMore 查看更多的回调函数
 * @param {number} minZoom 最小缩放级别
 * @param {number} zoom 初始化缩放级别
 * @param {arrray} center 中心点坐标
 * @param {arrray} provinceData 京外货车数据
 * @param {boolean} updateCenter 更新中心坐标，接受一个独一无二的时间戳
 *
 */

const Markers = ({
  scaleConfig = {},
  zoomToolConfig = {},
  originToolConfig = {},
  dimensionToolConfig = {},
  themeToolConfig = {},
  data = {},
  showMore,
  minZoom,
  zoom,
  center,
  isShowBeijingMarker = false,
  updateCenter,
  onClickMarker,
  includeAllProvince,
  checkboxToolConfig,
}) => {
  const { provinceData } = data;
  const { status: scaleStatus, right: scaleRight, bottom: scaleBottom } = scaleConfig;
  console.log(scaleRight,'scaleRight')
  const { status: originToolStatus, right: originToolRight, bottom: originToolBottom } = originToolConfig;
  // const { status: checkboxToolStatus } = checkboxToolConfig;
  const { status: dimensionToolStatus } = dimensionToolConfig;
  const { status: zoomToolStatus } = zoomToolConfig;
  const { status: themeToolStatus = true } = themeToolConfig;
  const [mapInstance, setMapInstance] = useState();
  // const [selectedType, setSelectedType] = useState('全部');
  const [selectedData, setSelectedData] = useState();
  const { selectedType, setSelectedType, update, theme,setCheckboxStatus,checkboxStatus } = useStore('gis');
  const { setIsShowCarFrom } = useStore('carOut');
  const [curProvince, setCurProvince] = useState('');
  let scaleDom; // scale的Dom
  //   const data = {markerData:[{
  //     carType: '罐车',
  //     markerId: '123',
  //     id: null,
  //     lat: '',
  //     lng: '',
  //     owner: '如皋市隆昌化学品运输有限公司',
  //     ownerId: '3399',
  //     plateNumber: '苏F57390',
  //     riskValue: '0',
  //     type: '社区菜市场',
  //     num: '',
  //   },
  //   {
  //     carType: '罐车',
  //     markerId: '123',
  //     id: null,
  //     lat: '39.9',
  //     lng: '116.38',
  //     owner: '如皋市隆昌化学品运输有限公司',
  //     ownerId: '3399',
  //     plateNumber: '苏F57390',
  //     riskValue: '0',
  //     type: '连锁超市',
  //     num: '',
  //   },],
  // zoneData:[]}
  // todo 需替换成真实接口
  // const data = [
  //   {
  //     carType: '罐车',
  //     id: null,
  //     lat: '40',
  //     lng: '116.5',
  //     owner: '如皋市隆昌化学品运输有限公司',
  //     ownerId: '3399',
  //     plateNumber: '苏F57390',
  //     riskValue: '0',
  //     type: '生产',
  //     num: '',
  //   },
  //   {
  //     carType: '罐车',
  //     id: null,
  //     lat: '39.9',
  //     lng: '116.8',
  //     owner: '如皋市隆昌化学品运输有限公司',
  //     ownerId: '3399',
  //     plateNumber: '苏F57390',
  //     riskValue: '0',
  //     type: '经营',
  //     num: '',
  //   },
  //   {
  //     carType: '罐车',
  //     id: null,
  //     lat: '39.9',
  //     lng: '116.5',
  //     owner: '如皋市隆昌化学品运输有限公司',
  //     ownerId: '3399',
  //     plateNumber: '苏F57390',
  //     riskValue: '0',
  //     type: '生产',
  //     num: '',
  //   },
  //   {
  //     carType: '罐车',
  //     id: null,
  //     lat: '42',
  //     lng: '116.5',
  //     owner: '如皋市隆昌化学品运输有限公司',
  //     ownerId: '3399',
  //     plateNumber: '苏F57390',
  //     riskValue: '0',
  //     type: '企业',
  //     num: '',
  //   },
  //   {
  //     carType: '罐车',
  //     id: null,
  //     lat: '42',
  //     lng: '115.6',
  //     owner: '如皋市隆昌化学品运输有限公司',
  //     ownerId: '3399',
  //     plateNumber: '苏F57390',
  //     riskValue: '0',
  //     type: '数量',
  //     num: 10,
  //   },
  // ];

  const selectedTypeData = (type) => {
    let selectedTypeList = [];
    if (type === '全部') {
      selectedTypeList = data;
      setSelectedType('全部');
    } else {
      selectedTypeList = data.filter((i) => i.type === type);
      setSelectedType(type);
      setSelectedData(selectedTypeList);
    }
  };

  // markerLayer相关的一些配置
  const typeList = {
    企业: 'enterprise-blue',
    批发市场: 'whole-sale-market',
    超市门店: 'market-store',
    连锁超市: 'super-market',
    直营直供: 'direct-sale',
    社区菜市场: 'food-market',
    前置仓: 'lead-warehouse',
    场所: 'site',
    人员: 'staff',
    车辆: 'direct-car',
    封控区: 'ban-dot',
    管控区: 'manage-dot',
    防范区: 'prewarn-dot',
    冷链卡口: 'code-chain',
    高速收费站: 'hignway-station',
    北京: 'beijing',
    出发地: 'direct-car',
    隔离: 'red-status',
    弹窗: 'yellow-status',
    白名单: 'white-status',
    正常: 'white-status',
    货车数量: 'car-num-popup',
    电商大仓: 'electric-supplies-warehouse',
    临时管控区: 'temporary-manage-area',
    蔬菜直通车: 'vegetable-car',
    关停门店: 'close-shop',
    京内临时通行证: 'temporary-pass',
    区级保供场所: 'zone-supply-site',
    缺补货: 'stockout'
  };
  const allTypes = {};
  const iconMap = {};
  const context = require.context('./assets/', true, /.png$/)
  Object.values(typeList).forEach((i) => {
    allTypes[`${i}-icon`] = `${i}-icon`;
    const imgName = `${i}-icon`;
    // iconMap[`${i}-icon`] = require(`@/views/Gis/Markers/assets/${theme}/${imgName}.png`);
    iconMap[`${i}-icon`] = context(`./${theme}/${imgName}.png`)
  });
  // console.log(allTypes,'allTypes')
  const transformData = (data = []) => {
    console.log(data,'data-----')
    data.forEach((i) => {
      i.iconType = allTypes[typeList[i.type] + '-icon'];
      i.iconNum = i.num;
      i.markerId = (i.type === '白名单' || i.type === '正常') && i?.id;
      i.lng = (i.type === '白名单' || i.type === '正常') ? i?.longitude : i.lng;
      i.lat = (i.type === '白名单' || i.type === '正常') ? i?.latitude : i.lat;
      i.markerType = (i.type === '白名单' || i.type === '正常') ? i?.type : i.markerType;
      i.num = '';
      i.popupType = (i.type === '白名单' || i.type === '正常') ? 5 : i.popupType;
      i.url = '';
    });
  };
  if (provinceData) {
    transformData(provinceData);
  }
  console.log(provinceData,'provinceData')
  const addIcon = (data = {}) => {
    // data.iconType = allTypes[typeList[data.type] + '-icon'];
    update({
      ...data,
      iconType: allTypes[typeList[data.type] + '-icon'],
    });
  };

  const onMapLoad = (e) => {
    setMapInstance(e.target);
    window.map = e.target;
    setSelectedData(data || []);
    if (scaleStatus) {
      const scale = new mapboxgl.ScaleControl({
        maxWidth: 80,
        unit: 'metric',
      });
      e.target.addControl(scale, 'bottom-right');
      scaleDom = document.getElementsByClassName('mapboxgl-ctrl-bottom-right')[0];
      if (scaleDom) {
        scaleDom.style.bottom = scaleBottom;
        scaleDom.style.right = scaleRight;
      }
    }
  };

  const renderPopup = (properties) => {
    return <PopupContent showMore={showMore} theme={theme} />;
  };

  //当选择类型时，更新数据
  useEffect(() => {
    if (!mapInstance) return;
    selectedTypeData(selectedType);
  }, [selectedType]);

  //当scale的参数发生改变的时候，重新画
  useEffect(() => {
    if (!mapInstance) return;
    scaleDom = document.getElementsByClassName('mapboxgl-ctrl-bottom-right')[0];
    if (scaleDom) {
      scaleDom.style.bottom = scaleBottom;
      scaleDom.style.right = scaleRight;
    }
  }, [scaleRight]);

  const clickBeijing = (e) => {
    if (!mapInstance) return;
    // console.log('Markers clickBeijing')
    mapInstance.easeTo({ center: [116.38111111, 39.911111111] });
    // setShowTracksTable(!showTracksTable)
  };

  const clickOutProvince = (data) => {
    if (!mapInstance) return;
    // mapInstance.easeTo({center:[+data.lng,+data.lat]})
    // mapInstance.setCenter([+data.lng,+data.lat])
    if (curProvince !== data.province) {
      setIsShowCarFrom(data.province);
      setCurProvince(data.province);
      return;
    }
    setIsShowCarFrom('');
    setCurProvince('');
  };

  return (
    <div className={styles['map-wrapper']} style={{ right: scaleRight, bottom: scaleBottom }}>
      <CommonMap load={onMapLoad} theme={theme}>
        {mapInstance && <RegionLayer map={mapInstance} includeAllProvince={includeAllProvince} />}
        {/* regionLayer写在MarkerLayer前，可保证底图缩放功能的实现 */}
        {mapInstance && (
          <MarkerLayer
            map={mapInstance}
            iconMap={iconMap}
            data={data}
            transformData={transformData}
            renderPopup={renderPopup}
            minZoom={minZoom}
            zoom={zoom}
            center={center}
            addIcon={addIcon}
            updateCenter={updateCenter}
            onClickMarker={onClickMarker}
          />
        )}
        {mapInstance && isShowBeijingMarker && (
          <Marker map={mapInstance} LngLat={[116.38, 39.9]} anchor='center'>
            <img
              src={require('./assets/beijing-icon.png')}
              alt='立标'
              style={{ width: '70px', height: '70px' }}
              onClick={(e) => {
                clickBeijing(e);
              }}
            />
          </Marker>
        )}
        {mapInstance &&
          provinceData &&
          provinceData.map((i) => (
            <Marker map={mapInstance} LngLat={[+i.lng, i.lat]} anchor='center'>
              <img
                src={require('./assets/origin-icon.png')}
                alt='外省货车'
                style={{ width: '59px', height: '70px' }}
                onClick={() => {
                  clickOutProvince(i);
                }}
              />
            </Marker>
          ))}
        {mapInstance && isShowBeijingMarker && <FlyLine3D map={mapInstance} data={data?.markerData} />}
      </CommonMap>
      {/* need todo */}
      {mapInstance && true && (
        <CheckboxMapTool
          checkboxToolConfig={checkboxToolConfig}
          map={mapInstance}
          setCheckboxStatus={setCheckboxStatus}
          checkboxStatus={checkboxStatus}
          theme={theme}
        />
      )}
      {mapInstance && zoomToolStatus && <ZoomMapTool zoomToolConfig={zoomToolConfig} map={mapInstance} />}
      {mapInstance && themeToolStatus && <ThemeTool themeToolConfig={themeToolConfig} map={mapInstance} />}
      {mapInstance && originToolStatus && <OriginTool map={mapInstance} originToolConfig={originToolConfig} theme={theme}/>}
      {mapInstance && dimensionToolStatus && (
        <DimensionTool dimensionToolConfig={dimensionToolConfig} map={mapInstance} />
      )}
      {/* {mapInstance && <DrawTool map={mapInstance} />} */}
    </div>
  );
};

export default observer(Markers);
