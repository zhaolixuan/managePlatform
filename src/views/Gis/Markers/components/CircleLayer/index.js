// import { mapboxgl } from 'mapbox-gl';
import { useEffect } from 'react';
import * as turf from '@turf/turf';

const CircleLayer = ({ data = [], map, radius, type, theme }) => {
  const options = { steps: 50, units: 'kilometers', properties: { foo: 'bar' } };
  // console.log(theme,'theme123')
  const addCircleSource = () => {
    const circle = turf.circle(data, radius / 1000, options);
    // const line = turf.lineString(...circle.geometry.coordinates);
    // todo: 根据 riskValue 生成 circleColor 的值
    if (map.getSource('enclosureSource1')) {
      map.getSource('enclosureSource1').setData(circle);
    } else {
      map.addSource('enclosureSource1', {
        type: 'geojson',
        data: circle,
      });
    }
  }
  const addCircleLayer = () => {
    const lifeLineColor = theme === 'white' ? '#038C3A' : '#038C3A';
    const sendLineColor = theme === 'white' ? '#50038C' : '#B360F4';
    const opacity = theme === 'white' ? 0.32 : 0.2;
    /* eslint-disable */
    map.addLayer({
      id: `circles-${type}-fill`,
      type: 'fill',
      source: 'enclosureSource1',
      paint: {
        'fill-color': type === 1 ? lifeLineColor : sendLineColor,
        'fill-opacity': opacity,
      },
    });
    map.addLayer({
      id: `circles-${type}-line`,
      type: 'line',
      source: 'enclosureSource1',
      paint: {
        'line-color': type === 1 ? lifeLineColor : sendLineColor,
        'line-width': 6,
        "line-dasharray": [2, 1]
      },
    });
    map.getLayer('zone-area-layer') && map.moveLayer(`circles-${type}-fill`,'zone-area-layer')
    map.getLayer(`jd-markers-icon`) && map.moveLayer(`circles-${type}-fill`,`jd-markers-icon`)
  }

  const addSourceAndLayer = () => {
    addCircleSource();
    addCircleLayer();
    setTimeout(()=>{
      if(!map.getSource('enclosureSource1')){
        addCircleSource();
        addCircleLayer();
      }
    },1000)
  }
    

  const removeLayers = () => {
    map.getLayer(`circles-${type}-fill`) && map.removeLayer(`circles-${type}-fill`);
    map.getLayer(`circles-${type}-line`) && map.removeLayer(`circles-${type}-line`);
    // map.getLayer('distributionLayer') && map.removeLayer('distributionLayer');
  };

  useEffect(() => {
    console.log('Circle Layer radius', radius)
    if(data && type && radius > 0){
      addSourceAndLayer();
    }else{
      removeLayers()
    }

    return () => {
      removeLayers(); // 移除图层点击事件
    };
  }, [data?.[0], type, radius]);

  useEffect(()=>{
    map.off('style.load',addSourceAndLayer)
    map.on('style.load',addSourceAndLayer)
    return(()=>{
      map.off('style.load',addSourceAndLayer)
    })
  },[theme])
  return <></>;
};

export default CircleLayer;
