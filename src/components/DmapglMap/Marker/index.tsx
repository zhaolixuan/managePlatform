// Generated with util/create-component.js
import React, { useEffect, useRef, Ref, useState } from 'react';
import withMap from '../BaseMap/withmap';
import { MarkerProps } from './Marker.types';

/**
 * @param {arry} LngLat: 坐标
 * @param {map} map: 地图实例
 * @param {HTMLElement} children: marker展示的内容
 * @param {fun} onXXX: 常用的几种回调函数。
 * @param {any} opts: 其他 mapbox-marker 支持的参数
 */
const Marker = React.forwardRef((props: MarkerProps, ref: Ref<any>) => {
	const [isPositionReady, setIsPositionReady] = useState(false); // 是否已经设置好位置了，不做这个的话会有闪烁问题

	const markerEl = useRef(null);
	const markerInstance = useRef(null);
	const prevProps = useRef(props);

	const {
		LngLat, map, children,
		...opts
	} = props;

	const onEvents = (event) => {
		if (props[event] instanceof Function) {
			props[event]({el: markerInstance.current, params: opts});
		}
	};

	useEffect(() => {
		markerInstance.current = new window.dmapgl.Marker({
			element: markerEl.current,
			...opts
		}).setLngLat(LngLat).addTo(map);

		setIsPositionReady(true);

		ref && Object.assign(ref, { current: markerInstance.current }); // 将 marker 实例，赋值给父级传过来的ref。暴露实例给外部
		// 清除绑定
		return () => {
			markerInstance.current && markerInstance.current.remove();
			console.log('图层卸载：Marker');
		};
	}, []);

	// 类似 componentWillReceiveProps：属性更新则通过实例方法改一下属性。不至于重绘组件
	useEffect(() => {
		if (props.draggable !== prevProps.current.draggable) {
			// eslint-disable-next-line max-len
			markerInstance.current && markerInstance.current.setDraggable(props.draggable);
			prevProps.current = props;
    }
		if (props.LngLat !== prevProps.current.LngLat) {
			markerInstance.current && markerInstance.current.setLngLat(props.LngLat);
			prevProps.current = props;
    }
		if (props.offset !== prevProps.current.offset) {
			markerInstance.current && markerInstance.current.setOffset(props.offset);
			prevProps.current = props;
		}
	}, [props]);

	return (
  <div>
    <div
      ref={markerEl}
      onClick={() => onEvents('onClick')}
      onDoubleClick={() => onEvents('onDoubleClick')}
      onMouseEnter={() => onEvents('onMouseEnter')}
      onMouseLeave={() => onEvents('onMouseLeave')}
      style={{ display: isPositionReady ? 'block' : 'none' }}
			>
      {children || <div style={{width:'20px',height: '20px',borderRadius:'50%',background:`${opts.color?opts.color:'#51bbd6'}`}}></div>}
    </div>
  </div>
	);
});

export default withMap(Marker);
