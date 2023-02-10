/* eslint-disable */
import { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import CommonMap from '@/components/BaseMap';
import MarkerLayer from './components/MarkerLayer';
import RegionLayer from './components/RegionLayer';
import { useStore } from '@/hooks';
// import StreetLayer from './components/StreetLayer';
import FlyLine3D from './components/FlyLine';
import CheckboxMapTool from './components/CheckboxMapTool';
import ThemeTool from './components/ThemeTool';
import PopupContent from './components/PopupContent';
import ZoomMapTool from './components/ZoomMapTool';
import OriginTool from './components/OriginTool';
import DimensionTool from './components/DimensionTool';
import Circle from './components/CircleLayer';
import 'mapbox-gl/dist/mapbox-gl.css';
import styles from './index.module.less';

/**
 *
 * @param {object} scaleConfig  比例尺的相关配置
 * @param {object} zoomToolConfig  缩放工具的相关配置
 * @param {boolean} originToolConfig 回到地图原点的相关配置
 * @param {array} data  传给地图的数据
 */

const Markers = ({ scaleConfig = {}, zoomToolConfig = {}, originToolConfig = {},
  themeToolConfig = {},
  dimensionToolConfig = {},  showMore, data = [], zoneData, siteData=[], carsData=[], flyTo=[], radius=0, liveType=0, zoom,
  onClickMarker,
  checkboxToolConfig,
  theme,
  seletedData
}) => {
  const { status: scaleStatus, right: scaleRight, bottom: scaleBottom } = scaleConfig;
  const { status: originToolStatus, right: originToolRight, bottom: originToolBottom } = originToolConfig;
  const { status: zoomToolStatus } = zoomToolConfig;
  const { status: dimensionToolStatus } = dimensionToolConfig;
  const { status: themeToolStatus = true } = themeToolConfig;
  // const { status: checkboxToolStatus } = checkboxToolConfig; need todo
  const [mapInstance, setMapInstance] = useState();
  const [markerData, setMarkerData] = useState();
  const { setCheckboxStatus,checkboxStatus } = useStore('gis');
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
    // console.log('imgName',imgName);
    iconMap[`${i}-icon`] = context(`./${theme}/${imgName}.png`);
  });

  const transformData = (data = []) => {
    data.forEach((i) => {
      i.iconType = allTypes[typeList[i.type||i.sealingType] + '-icon'];
      i.iconNum = i.num;
    });
  };

  const backToOrigin = (point) => {
    // console.log('backToOrigin');
    // mapInstance && mapInstance.easeTo({ center: point ? point:[116.38, 39.9] });
  };

  const onMapLoad = (e) => {
    
    setMapInstance(e.target);
   
    setMarkerData(data);
    if (scaleStatus) {
      const scale = new window.dmapgl.ScaleControl({
        maxWidth: 100,
        unit: 'metric',
      });
      e.target.addControl(scale, 'bottom-right');
      const scaleDom = document.getElementsByClassName('mapboxgl-ctrl-scale')[0];
      if(scaleDom){
        scaleDom.style.bottom = scaleBottom;
        scaleDom.style.right = scaleRight;
      }
    }
  };

  const renderPopup = (properties) => {
    return <PopupContent  showMore={showMore} />;
  };

  const addIcon = (data = {}) => {
    // data.iconType = allTypes[typeList[data.type] + '-icon'];
  }

  useEffect(()=>{
    if(flyTo && flyTo.length > 1){
      backToOrigin(flyTo)
    }
  },[flyTo])

  useEffect(() => {
    
    let list = []
    if(data){
      list.push.apply(list, data);
    }
    // if(poiData){
    //     list.concat(poiData);
    // }
    if(siteData){
      list.push.apply(list, siteData);
    }
    if(carsData){
      list.push.apply(list, carsData);
    }
    setMarkerData(list);
  },[data, siteData?.length, carsData?.length]);

  return (
    <div className={styles['map-wrapper']} style={{ right: scaleRight, bottom: scaleBottom }}>
      <CommonMap load={onMapLoad} pitch='0' dragRotate={false} theme={theme}>
        {/* {mapInstance && <StreetLayer map={mapInstance} /> } */}
        {mapInstance && <RegionLayer map={mapInstance} /> }
        {mapInstance && (
          <MarkerLayer
            map={mapInstance}
            iconMap={iconMap}
            addIcon={addIcon}
            data={{markerData, zoneData}}
            transformData={transformData}
            renderPopup={renderPopup}
            zoom={zoom}
            onClickMarker={onClickMarker}
            seletedData={seletedData}
          />
        )}
        {mapInstance && <Circle map={mapInstance} theme={theme} data={flyTo || []} type={liveType} radius={radius}/>}
        {/* {mapInstance && <FlyLine3D map={mapInstance} data={data}/>} */}
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
      {mapInstance && true && <ThemeTool themeToolConfig={themeToolConfig} map={mapInstance} />}
      {mapInstance && originToolStatus && <OriginTool map={mapInstance} originToolConfig={originToolConfig} theme={theme}/>}
      {mapInstance  && <DimensionTool dimensionToolConfig={dimensionToolConfig} map={mapInstance} />}
    </div>
  );
};

export default Markers;
