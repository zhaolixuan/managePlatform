/**
 * @param {Number}  zoom 地图缩放等级
 * @param {Array}  center 中心点坐标
 * @param {Object|JSON}  style 地图样式
 * @param {Number}  height 地图高度
 */
// 地图公共组件
import React, { Component } from 'react';
import { BaseMap } from '@/components/DmapglMap';

const style = {
  width: '100%',
  height: '100vh',
  // minHeight: '1080px',
  position: 'absolute',
  zIndex: 0,
  top: 0,
  background: '#003d5c',
};
class CommonMap extends Component{

  mapInstance = null;
  /* eslint-disable */
  backgroundLoad = () => {
    const config = this.props.mapConfig
    this.mapInstance.getLayer('beijing-background') && this.mapInstance.removeLayer('beijing-background')
    this.mapInstance.addLayer({
      id: 'beijing-background',
      type: 'background',
      paint: {
        'background-color': config.backgroundColor
      }
    });
    this.mapInstance.moveLayer('beijing-background','background')
    this.mapInstance.moveLayer('background','beijing-background')
  };

  mapLoad = (map) => {
    this.mapInstance = map.target;
    const { load, initialZoom = 18, initialCenter=[116.38, 40.245999] } = this.props;
    // this.backgroundLoad();
    load && load(map); // 地图实例抛给外部
    map.target.easeTo({ center: initialCenter, zoom: initialZoom })
  };

  componentDidUpdate(preProps){
    // this.mapInstance && this.props.mapConfig.style !== preProps.mapConfig.style && this.backgroundLoad();
  }
  
  render() {
    const { mapConfig, mapStyle, children, initialZoom = 12, initialCenter=[116.38, 40.245999], ...others } = this.props;
    initialZoom && Object.assign(mapConfig, {zoom: initialZoom})
    initialCenter && Object.assign(mapConfig, {center: initialCenter})
    return (
      <div style={mapStyle || style}>
        <BaseMap
          {...mapConfig}
          {...others}
          load={this.mapLoad}
          height='100%'
        >
          {children}
        </BaseMap>
      </div>
    );
  }
}

export default CommonMap;
