import { useEffect } from 'react';
/**
 *
 * @param {*} map 地图实例
 * @param {*} data 线段点(起始终点经纬度集合) [{id,line:[116.444059, 39.890038,116.167033, 39.888752], ...info},{id,line:[116.444059, 39.890038,116.167033, 39.888752], ...infog}]
 * @returns
 */
function FlyLine3D({ map, data }) {
  let tb = null;
  const arcSegments = 15;

  const getLine = (point) => {
    /* eslint-disable */
    const line = [];
    // [116.444059, 39.890038,116.167033, 39.888752]
    const destination = [116.3800000, 39.900000]; // [point[2], point[3]]黑夜北京
    const increment = [point[0], point[1]];
    const maxElevation = Math.pow(Math.abs(destination[0]*increment[0]), 0.5) * 500;
    const x = (destination[0] - increment[0]) / arcSegments;
    const y = (destination[1] - increment[1]) / arcSegments;
    for (var l = 0; l<=arcSegments; l++){
        const waypoint = increment.map(function(direction, i){
            return direction + (i === 0 ? x * l : y * l);
        });
        const waypointElevation = Math.sin(Math.PI*l/arcSegments) * maxElevation;

        waypoint.push(waypointElevation);
        line.push(waypoint);
    }
    return line
  };

  const addSource = () =>{
    if (map.getSource('flyLineSource')) {
        map.getSource('flyLineSource').setData([]);
    } else {
        map.addSource('flyLineSource', {
            type: 'geojson',
            data: [],
        });
    }
  };
  // instantiate threebox
  const addLayer = () => {
    // map.on('style.load', function () {
    map.addLayer({
      id: 'flyLineLayer',
      type: 'custom',
      source: 'flyLineSource',
      onAdd: function (map, mbxContext) {
        tb = new Threebox(map, mbxContext, {
          defaultLights: true,
        });

        for (let el of data) {
          if(!el.showFlyLine)continue;
          const line = getLine(el.line);
          const lineOptions = {
            geometry: line,
            color: (line[1][1] / 180) * 0xffffff, // color based on latitude of endpoint
            width: 2, // random width between 1 and 2
          };

          const lineMesh = tb.line(lineOptions);

          tb.add(lineMesh);
        }
      },
      render: function () {
        tb.update();
      },
    });
    //   });
  };
  const removeLayers = () => {
    map.getLayer(`flyLineLayer`) && map.removeLayer(`flyLineLayer`);
    // map.getLayer('distributionLayer') && map.removeLayer('distributionLayer');
  };

  useEffect(()=>{
    data && data.length>0 && map && addSource();
    data && data.length>0 && map && addLayer();
    return () => {
        removeLayers(); // 移除图层点击事件
    };
  },[data]);
  return <></>;
}
export default FlyLine3D;
