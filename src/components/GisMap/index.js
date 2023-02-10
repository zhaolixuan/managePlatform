/* eslint-disable */
/**
 * 自定地图组件
 * @param {Array}   center 中心点坐标
 * @param {Number}  zoom 地图缩放等级
 * @param {Object}  toolConfig 地图工具 {show=true, top, left, right, bottom}
 * @param {Object}  scaleConfig 地图比例尺工具 {show=true, top, left, right, bottom}
 * @param {Array}   markerData marker点数据
 * @param {Object}  activeMarker 选中点 {markerId, lng, lat, type, showPopup, popupType}
 * @param {Object}  activeMarkerZone 选中散点区域 [{type:'zone',data:[[lng,lat]]},{type:'life', center:[lng, lat], radius:1500},{type:'send', center:[lng, lat], radius:3000}]
 * @param {String}  activeArea 选中区域
 * @param {Boolean} showProvince 是否显示全国省边界
 * @param {Function} handleMarkerClick 地图Marker选择回调
 * @param {Object} flyLineData 是否显示FlyLine
 * @param {Function} setCarFrom 将外省份车辆的数据写入store
 *
 */
import React, { memo, useEffect, useState } from 'react';
import { useStore } from '@/hooks';
import { lightConfig, darkConfig } from './utils/mapConfig';
import BaseMap from './components/BaseMap';
import ToolLayer from './components/ToolLayer';
import MarkerLayer from './components/MarkerLayer';
import RegionLayer from './components/RegionLayer';
import styles from './index.module.less';
import FlyLine3D from './components/FlyLine';

const GisMap = memo(
  ({
    center,
    zoom,
    toolConfig = { show: true },
    scaleConfig = {},
    markerData = [],
    activeMarker,
    activeZone,
    activeArea,
    showProvince,
    handleMarkerClick,
    changeLegend,
    flyLineData,
    setCarFrom,
  }) => {
    const gis = useStore('gis');
    const [map, setMapInstance] = useState(); // 地图实例
    const [config, setConfig] = useState(gis.theme === 'dark' ? darkConfig : lightConfig); // 地图主题及参数默认配置
    const [dimension, setDimension] = useState('2D'); // 二三维
    const [legend, setLegend] = useState(false); // 图例
    const { right: scaleRight, bottom: scaleBottom } = scaleConfig; // 比例尺的配置

    console.log(markerData, 1234);

    // 二三维切换
    const changeDimension = () => {
      if (dimension === '2D') {
        setDimension('3D');
        map.resetNorthPitch({ pitch: 60, duration: 1000 });
      } else {
        setDimension('2D');
        map.resetNorthPitch({ pitch: 0, duration: 2500 });
      }
    };

    // 主题切换
    const changeTheme = () => {
      gis.setTheme(gis.theme === 'dark' ? 'white' : 'dark');
      setConfig(gis.theme === 'dark' ? darkConfig : lightConfig);
    };

    // 缩放
    const changeZoom = (operator, zoom) => {
      console.log('Change Zoom', zoom)
      const curZoom = map.getZoom();
      if (operator === '+') {
        map.setZoom(curZoom + 0.5);
      } else if (operator === '-') {
        map.setZoom(curZoom - 0.5);
      } else if (zoom) {
        map.setZoom(zoom);
      }
    };

    // 展示图例
    const showLegend = () => {
      changeLegend && changeLegend(!legend);
      setLegend(!legend);
    };
    // 跳转到中心点
    const easeTo = (center) => {
      if (center) {
        map.easeTo({ center });
      } else {
        map.easeTo({ center: config.map.center, zoom: config.map.zoom });
      }
    };

    // 比例尺
    const initScale = (mapInstance) => {
      const scale = new window.dmapgl.ScaleControl({
        maxWidth: 80,
        unit: 'imperial',
      });
      mapInstance.addControl(scale, 'bottom-right');
      const scaleDom = document.getElementsByClassName('mapboxgl-ctrl-bottom-right')[0];
      if (scaleDom) {
        scaleDom.style.bottom = scaleBottom;
        scaleDom.style.right = scaleRight;
      }
    };
    // 回到初始
    const reset = (that) => {
      if(flyLineData){ // 全国地图时
        map.fitBounds([[68.73046875, 55.62799595426723],[147.3046875, 13.239945499286312]])
        return;
      }
      const { right } = toolConfig
      const userArea = sessionStorage.getItem('area')
      const area = bjAreaBoundary.features.filter(el => (userArea || '北京') === el.properties.name )?.[0]
      const bound = area? area.properties.bound : null
      const rem = (window.flexible?.rem || 100) / 100
      const rPannel = right ? typeof right === 'number' ? right : right.replace('px','') : 230
      bound && map.fitBounds(bound, { padding: {top: +rPannel*rem < 100 ? 10 : 150*rem, bottom:10, left: +rPannel*rem, right: +rPannel*rem} })
    }
    /** 初始化地图后回调 */
    const mapLoad = (e) => {
      // 设置地图返回地图实例
      setMapInstance(e.target);
      toolConfig && ToolLayer.show !== false && initScale(e.target);
    };

    useEffect(() => {
      setConfig(gis.theme === 'dark' ? darkConfig : lightConfig);
    }, [gis.theme]);

    useEffect(() => {
      map && center && setTimeout(() => easeTo(center), 1100);
      map && zoom && setTimeout(() => changeZoom('', zoom), 1000);
    }, [map]);

    useEffect(() => {
      map && easeTo(center);
    }, [JSON.stringify(center)]);

    useEffect(() => {
      map && zoom && changeZoom('', zoom);
    }, [zoom]);

    //当scale的参数发生改变的时候，重新画
    useEffect(() => {
      if (!map) return;
      const scaleDom = document.getElementsByClassName('mapboxgl-ctrl-bottom-right')[0];
      if (scaleDom) {
        scaleDom.style.bottom = scaleBottom;
        scaleDom.style.right = scaleRight;
      }
    }, [scaleRight]);

    return (
      <div className={styles.map_wrap}>
        <BaseMap mapConfig={config.map} initialZoom={zoom} initialCenter={center} load={mapLoad}>
          {map && (
            <MarkerLayer
              config={config.layer}
              map={map}
              data={markerData}
              activeMarker={activeMarker}
              activeMarkerZone={activeZone}
              markerClick={handleMarkerClick}
              easeTo={easeTo}
              changeZoom={changeZoom}
              theme={gis.theme}
              setCarFrom={setCarFrom}
            />
          )}
          {map && <RegionLayer config={config.layer} map={map} activeArea={activeArea} showProvinces={showProvince} {...toolConfig}/>}
        </BaseMap>
        {flyLineData && flyLineData.show && <FlyLine3D map={map} data={flyLineData.data} />}
        {map && toolConfig && ToolLayer.show !== false && (
          <ToolLayer
            {...toolConfig}
            dimension={dimension}
            changeDimension={changeDimension}
            changeZoom={changeZoom}
            changeTheme={changeTheme}
            showLegend={showLegend}
            easeTo={reset}
          />
        )}
      </div>
    );
  },
  (preProps, nextProps) => {
    return (
      JSON.stringify({
        center: preProps.center,
        zoom: preProps.zoom,
        activeArea: preProps.activeArea,
        activeMarker: preProps.activeMarker,
        activeMarkerZone: preProps.activeMarkerZone,
        toolConfig: preProps.toolConfig,
        flyLineShow: preProps.flyLineData && preProps.flyLineData.show,
        scaleConfig: preProps.scaleConfig,
      }) ===
        JSON.stringify({
          center: nextProps.center,
          zoom: nextProps.zoom,
          activeArea: nextProps.activeArea,
          activeMarker: nextProps.activeMarker,
          activeMarkerZone: nextProps.activeMarkerZone,
          toolConfig: nextProps.toolConfig,
          flyLineShow: nextProps.flyLineData && nextProps.flyLineData.show,
          scaleConfig: nextProps.scaleConfig,
        }) && preProps.markerData?.length === nextProps.markerData?.length
    );
  },
);

export default GisMap;
