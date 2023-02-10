// Generated with util/create-component.js
import React, { useEffect,useRef, Ref } from 'react';
// import mapboxgl from 'mapbox-gl';
import ReactDOM from 'react-dom';
import withMap from '../BaseMap/withmap';
import { randomId } from '../util';
import { PopupProps } from './Popup.types';

// import './Popup.less';

const Popup = React.forwardRef(({
  map,
  className,
  anchor,
  closeButton = true,
  closeOnClick = true,
  offset,
  html,
  LngLat,
  close, // 关闭后的回调
  maxWidth = '300px',
}: PopupProps, ref: Ref<any>) => {
  const popupIns = useRef<any>();
  useEffect(() => {

    const popUpId = `custompopupid${randomId()}`;
    const htmlStr = `<div id=${popUpId}></div>`;
    popupIns.current = new window.dmapgl.Popup({
      closeButton,
      closeOnClick,
      anchor,
      offset,
      className,
    });
    popupIns.current.setLngLat(LngLat)
    .setHTML(htmlStr)
    .setMaxWidth(maxWidth)
    .addTo(map);
    const box = document.querySelector(`div#${popUpId}`);
    if (React.isValidElement(html)) {
      ReactDOM.render(html, box);
    } else {
      ReactDOM.render(<div>{html}</div>, box);
    }
    if (close instanceof Function){
      popupIns.current.on('close',(e) => {
        close instanceof Function && close(e,map);
      });
    }
    ref && Object.assign(ref, { current: popupIns.current }); // 将 marker 实例，赋值给父级传过来的ref。暴露实例给外部
		// 清除绑定
		return () => {
			popupIns.current && popupIns.current.remove();
      console.log('卸载图层Popup');
		};
  }, [html, LngLat]);
  return null;
});

export default withMap(Popup);
