/* eslint-disable */
import React, { useEffect, useState } from 'react';
import {useStore} from '@/hooks';
import CommonMap from '@/views/Gis/Markers/components/BaseMap';
import MarkerLayer from '@/views/Gis/Markers/components/MarkerLayer';
import RegionLayer from '@/views/Gis/Markers/components/RegionLayer';
// import SingleMarker from '@/views/Gis/Markers/components/SingleMarkerLayer';
import PopupSimple from '@/views/Gis/Markers/components/PopupContent';
// import ZoomMapTool from '@/views/Gis/Markers/components/ZoomMapTool';
import CircleLayer from '@/views/Gis/Markers/components/CircleLayer'
const Map = () => {
  const [mapInstance, setMapInstance] = useState();
  // const [selectedType, setSelectedType] = useState('全部');
  const [selectedData, setSelectedData] = useState();
  const {selectedType,setSelectedType} = useStore('gis')
  const [showScan, setShowScan] = useState(false);
  const d = [116.961932, 40.051358];
  // todo 需替换成真实接口
  const allData = [{
    carType: "罐车",
    districts: "泗洪县",
    enterpriseKindSecond: null,
    gridId: "321324101009002",
    happenTime: null,
    id: null,
    infoList: null,
    lat: "40.051358",
    lng: "116.961932",
    owner: "如皋市隆昌化学品运输有限公司",
    ownerId: "3399",
    plateNumber: "苏F57390",
    pointType: null,
    prewarningContext: null,
    riskValue: "0",
    taskStatus: null,
    text: null,
    type: "封控",
    value: null,
    time: '2022-04-30',
    circleType: 1
  }]

  const selectedTypeData = (type) => {
    let selectedTypeList = [];
    if (type === '全部') {
      selectedTypeList = allData;
      setSelectedType('全部');
    } else {
      selectedTypeList = allData.filter(i=>i.type===type)
      setSelectedType(type);
      setSelectedData(selectedTypeList);
    }
  };

  // markerLayer相关的一些配置
  const typeList = {
    封控: '1',
    管控: '2',
    防范: '3',
  };
  const allTypes = {};
  const iconMap = {};
  Object.values(typeList).forEach(i => {
      allTypes[`${i}-icon`] = `${i}-icon`;
      const imgName = `point-${i}`;
      iconMap[`${i}-icon`] = require(`../assets/${imgName}.png`);
  });
//   console.log(iconMap,'iconMap')
  const transformData = (data) => {
    data.forEach(i => {
      i.iconType = allTypes[typeList[i.type] + '-icon'];
    });
  };

  const onMapLoad = (e) => {
    // console.log(e.target, 'e------');
    setMapInstance(e.target);
    setSelectedData(allData);
  };

  const renderPopup = (properties) => {
    // console.log(properties,'properties')
    setShowScan(true);
    return (
      <PopupSimple
        key={properties.time}
        data={{title: properties.type, detail:{time: properties.time, type:typeList[properties.type]}}}
      />
    );
  }

  //当选择类型时，更新数据
  useEffect(() => {
    if (!mapInstance) return;
    selectedTypeData(selectedType);
  }, [selectedType]);

  return (
    <div>
      <CommonMap load={onMapLoad} pitch='0' dragRotate={false}>
        {/* {mapInstance && <RegionLayer map={mapInstance} region='朝阳区' />} */}
        {/* {mapInstance && <SingleMarker  map={mapInstance} data={d} showScan={showScan}></SingleMarker>} */}
        {/* {mapInstance && <MarkerLayer
         map={mapInstance} 
         iconMap={iconMap}
         data={selectedData}
         transformData={transformData}
         renderPopup={renderPopup}
         />} */}
         {mapInstance && <CircleLayer map={mapInstance} data={selectedData} transformData={transformData}/>}
      </CommonMap>
      {/* {mapInstance && <ZoomMapTool map={mapInstance} />} */}
      {/* {mapInstance && <Scale map={mapInstance} />} */}
    </div>
  );
};

export default Map;
