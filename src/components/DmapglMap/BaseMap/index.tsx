/* eslint-disable max-len */
import React, { Component, createRef } from 'react';
// import 'mapbox-gl/dist/mapbox-gl.css';
import mapContext from './context';
import { MapProps } from './BaseMap.types';
import './BaseMap.less';
import { isEqual } from '../util';
// map回调的绑定事件
const eventList = [
  'resize',
  'remove',
  'mousedown',
  'mouseup',
  'mouseover',
  'mousemove',
  'click',
  'dblclick',
  'mouseenter',
  'mouseleave',
  'mouseout',
  'contextmenu',
  'wheel',
  'touchstart',
  'touchend',
  'touchmove',
  'touchcancel',
  'movestart',
  'move',
  'moveend',
  'dragstart',
  'drag',
  'dragend',
  'zoomstart',
  'zoom',
  'zoomend',
  'rotatestart',
  'rotate',
  'rotateend',
  'pitchstart',
  'pitch',
  'pitchend',
  'boxzoomstart',
  'boxzoomend',
  'boxzoomcancel',
  'webglcontextlost',
  'webglcontextrestored',
  'load',
  'render',
  'idle',
  'error',
  'data',
  'styledata',
  'sourcedata',
  'dataloading',
  'styledataloading',
  'sourcedataloading',
  'styleimagemissing',
];
// map监听的变量及对应的修改方法
const mapWatchMapper = {
  style: 'setStyle',
  center: 'setCenter',
  zoom: 'setZoom',
  pitch: 'setPitch',
  bearing: 'setBearing',
};
class BaseMap extends Component<
  MapProps,
  {
    ready: boolean;
    map: null ;// | mapboxgl.Map;
  }
> {
  containerRef: any = createRef();

  mapInstance: any;

  constructor(props) {
    super(props);
    // this.containerRef = createRef();
    this.state = {
      ready: false,
      map: null,
    };
  }

  componentDidMount() {
    const {
      center = [116.391, 39.9167],
      zoom = 5,
      minZoom = 3,
      maxZoom = 18,
      // children,
      // style = 'zyzx://custom/LY8TZLUq_zx035hVoW86D.json',
      style = 'zyzx://custom/hvcRzD636NIrG_Y3531qn.json',
      pitch = 0,
      bearing = 0,
      epsg = 'EPSG:4479', // 国家2000坐标系
      antialias = false,
      ...others
    } = this.props;
    // @ts-ignore
    window.dmapgl.serviceUrl = `${window.GLOBAL_CONFIG.baseMapUrl}/jinxin/icity-support-screen`;
    this.mapInstance = new window.dmapgl.Map({
      zoom, // 地图默认缩放等级
      minZoom, // 地图最小缩放等级
      maxZoom, // 地图最大缩放等级
      fadeDuration: 0, // 控制标注淡入淡出的动画过渡时间, 单位为毫秒
      center, // 初始化地图显示中心点
      pitch, // 地图倾斜度
      bearing,
      style, // 样式文件地址
      epsg, // 
      antialias,
      localIdeographFontFamily: ' "Microsoft YaHei Bold","Microsoft YaHei Regular", sans-serif', // 设置为本地
      container: this.containerRef.current,
      ...others,
    });
    const { props } = this;
    eventList.forEach((key) => {
      this.mapInstance.on(key, (e) => {
        if (props[key] instanceof Function) {
          props[key](e);
        }
      });
    });

    this.setState({
      map: this.mapInstance,
    });
    this.mapInstance.on('load', () => {
      this.setState({
        ready: true,
      });
    });
  }

  componentDidUpdate(preProps) {
    const { props } = this;
    const { map } = this.state;
    if (!map) return;
    Object.keys(mapWatchMapper).forEach((key) => {
      if (!isEqual(props[key], preProps[key])) {
        // @ts-ignore
        map[mapWatchMapper[key]](props[key]);
      }
    });
  }

  componentWillUnmount() {
    const { props } = this;
    eventList.forEach((key) => {
      this.mapInstance?.off(key, (e) => {
        if (props[key] instanceof Function) {
          props[key](e);
        }
      });
    });
  }

  render() {
    const { height = '500px', children } = this.props;
    const { map, ready } = this.state;
    return (
      <mapContext.Provider value={map}>
        <div ref={this.containerRef} className='map' style={{ height }}>
          {ready && children}
        </div>
      </mapContext.Provider>
    );
  }
}
export default BaseMap;
