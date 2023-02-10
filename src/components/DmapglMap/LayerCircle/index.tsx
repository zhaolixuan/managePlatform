/* eslint-disable prefer-spread */
// Generated with util/create-component.js
import { useEffect, useState, useCallback } from 'react';
import withMap from '../BaseMap/withmap';
import { removeLayerSource , useProperty} from '../util';
import { LayerCircleProps, styleProps } from './LayerCircle.types';

function LayerCircle({
  map,
  id,
  data,
  valueKey,
  style,
  colors,
  sizeLevel,
  sizeBase,
  layout,
  paint,
}: LayerCircleProps) {
  const [init, setInit] = useState(false);
  
  const maxData = count => {
    const max = Math.max.apply(
      Math,
      data.features.map(item => {
        return item.properties[count];
      }),
    );
    return max;
  };
  // 计算气泡的颜色
  const pointColor = () => {
    if (!colors) return '#1b9dfd';
    if (Array.isArray(colors) && valueKey) {
      const radiusArr = ['step', ['get', valueKey]];
      const max = maxData(valueKey);
      const colorLevel = colors.length;
      const interval = Math.ceil(Math.ceil(max) / colorLevel);
      const grades = [];
      let i = 1;
      while (i < colorLevel + 1) {
        grades.push(colors[i - 1]);
        if (i < colorLevel) grades.push(i * interval);
        i += 1;
      }
      return [...radiusArr, ...grades]; // 一个颜色范围数组
    }
    return colors[0] || '#c8d2f1';
  };

  // 计算气泡大小
  const pointSize = () => {
    if (sizeLevel) {
      const radiusArr = ['step', ['get', valueKey]];
      const max = maxData(valueKey);
      const realLevel = sizeLevel - 1;
      const interval = Math.ceil(Math.ceil(max) / realLevel);
      const grades = [];
      let i = 1;
      while (i < realLevel) {
        grades.push(i * sizeBase);
        grades.push(i * interval);
        if (i + 1 === realLevel) {
          grades.push((i + 1) * sizeBase);
        }
        i += 1;
      }
      return [...radiusArr, ...grades];
    }
    return ['get', 'radius'] || 10;
  };


  const getPaintValue = useCallback(
    // eslint-disable-next-line no-shadow
    (paint: any, style: styleProps) => {
      const { opacity, strokeWidth } = style || {
        opacity: 0.3,
        strokeWidth: 1,
      };
      const basePaint = {
        'circle-color': pointColor(),
        'circle-stroke-color': pointColor(),
        'circle-radius': pointSize(),
        'circle-stroke-width': strokeWidth,
        'circle-opacity': opacity,
      };

      return { ...basePaint, ...paint};
    },
    [valueKey, style, colors, sizeLevel, sizeBase, paint],
  );

  useEffect(() => {
    // 初始化
    if (!init) {
      setInit(true);
      map.addSource(id, {
        type: 'geojson',
        data,
      });
      map.addLayer({
        id,
        source: id,
        type: 'circle',
        paint: getPaintValue(paint, style),
      });
      // 数据更新
    } else {
      map.getSource(id).setData(data);
    }
  }, [data]);

  useProperty(
    {
      id,
      map,
      init,
      layout,
      paint: () => getPaintValue(paint, style),
    },
    [getPaintValue],
  );

  // 组件卸载
  useEffect(() => {
    return () => {
      removeLayerSource(map, id);
    };
  }, []);
  return null;
}

export default withMap(LayerCircle);
