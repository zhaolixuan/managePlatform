/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { observer, inject } from 'mobx-react';
import JdProgress from '@/components/Progress';
import { useRouter, useStore } from '@/hooks'; // 业务中，和路由相关的使用此hooks
import * as api from '@/api/gisOther';
import Markers from '@/components/GisMap';
import Card from './Card';
import TruckList from '@/components/TruckList';
import TableTab from '@/components/TableTab';
import ImageTab from '@/components/ImageTab';
import CheckBox from '@/components/CheckBox';
import { provinceCenters } from './province';
import styles from './index.module.less';
import {
  getOutCitySupplyData,
  getOutCityCarCountData,
  getOutCityGoodSupplyData,
  getCarFromOutProvinceData,
  getPointPositionData,
} from '@/api/carOut';

const checkAllList = [
  {
    label: '批发市场',
    icon: 'wholeSaleMarket',
    value: 1,
  },
  {
    label: '连锁超市',
    icon: 'superMarket',
    value: 2,
  },
  {
    label: '直营直供',
    icon: 'directSale',
    value: 3,
  },
  {
    label: '社区菜市场',
    icon: 'foodMarket',
    value: 4,
  },
  {
    label: '前置仓',
    icon: 'leadWarehouse',
    value: 5,
  },
];

function CarOut({ gis }) {
  const store = useStore('carIn');

  const {
    carOutImageOption,
    getCarOutTopSixImageOption,
    getSupplyFromPosition,
    carFromProvince,
    setCarFrom
  } = useStore('carOut');
  const {
      checkboxStatus,
      setCheckboxStatus,
      theme,} = useStore('gis');
  const {
    query: { iframe },
  } = useRouter();
  const [outCitySupply, setOutCitySupply] = useState([]);
  const [maxWeight, setMaxWeight] = useState(0);
  const [zoom, setZoom] = useState(0);
  const [outCityCarCount, setOutCityCarCount] = useState([]);
  const [outCityGoodSupply, setOutCityGoodSupply] = useState([]);
  const [carFromOutProvince, setCarFromOutProvince] = useState([]);
  const [carOutMarkerData, setCarOutMarkerData] = useState([]);
  const [isShowCarFrom, setIsShowCarFrom] = useState(false);
  const [carListFromProvince, setCarListFromProvince] = useState([]);
  const [mapData, setMapData] = useState({});
  const [showLeft, setShowLeft] = useState(true);
  const [showRight, setShowRight] = useState(true);
  const [selectType, setSelectType] = useState(['冷链卡口', '高速收费站']);

  const positionIcon = !iframe ? (showRight ? 386 : 22) : '760px';
  const scaleRight = !iframe ? (showRight ? '23%' : '4%') : '760px';

  const showChange =
    (type = 'left') =>
    () => {
      type === 'left' ? setShowLeft(!showLeft) : setShowRight(!showRight);
    };

  const outCityColumns = [
    {
      title: '来源地',
      dataIndex: 'province',
      key: 'province',
      width: '25%',
    },
    {
      title: '货物类型',
      dataIndex: 'kinds',
      key: 'kinds',
      align: 'left',
      ellipsis: true,
    },
    {
      title: '物资（吨）',
      dataIndex: 'weightCount',
      key: 'weightCount',
      width: '40%',
      align: 'right',
      render: (text, item) => (
        <div className={styles.carOutPercent}>
          <JdProgress percent={(100 * item.weightCount) / maxWeight || 0} size='small' steps={20} showInfo={false} theme={theme}/>
          <span>{text}</span>
        </div>
      ),
    },
  ];

  const goodSupplyColumns = [
    {
      title: '货物类别',
      dataIndex: 'goodsType',
      key: 'goodsType',
    },
    {
      title: '数量',
      dataIndex: 'goodsWeight',
      key: 'goodsWeight',
      align: 'right',
    },
  ];

  const checkList = [
    {
      label: '冷链卡口(26)',
      icon: 'codeChain',
      value: '冷链卡口',
    },
    {
      label: '高速收费站(130)',
      icon: 'hignwayStation',
      value: '高速收费站',
    },
    {
      label: '物流线',
      icon: 'logisticsLine',
      value: '物流线',
    },
  ];

  const truckColumns = [
    {
      title: '车牌号',
      dataIndex: 'carPlate',
      key: 'carPlate',
      width: '5%',
      ellipsis: true,
    },
    {
      title: '司机姓名',
      dataIndex: 'driverName',
      key: 'driverName',
      align: 'center',
      width: '10%',
      ellipsis: true,
    },
    {
      title: '联系电话',
      dataIndex: 'driverPhone',
      key: 'driverPhone',
      align: 'center',
      width: '10%',
      ellipsis: true,
    },
    {
      title: '冷链车',
      dataIndex: 'coldChain',
      key: 'coldChain',
      align: 'center',
      width: '5%',
    },
    {
      title: '品类',
      dataIndex: 'goodsType',
      key: 'goodsType',
      width: '5%',
      ellipsis: true,
    },
    {
      title: '数量（吨）',
      dataIndex: 'goodsWeight',
      key: 'goodsWeight',
      align: 'right',
      width: '8%',
      ellipsis: true,
    },
  ];

  const getRoadPointPosition = async (pointTypes = ['高速收费站', '冷链卡口']) => {
    try {
      const res = await getPointPositionData();
      const highSpeeds = Array.from(res.highSpeeds, (item) => ({
        ...item,
        markerId: item.id,
        type: '高速收费站',
        popupType: '',
        dataType: 'highSpeeds',
        lng: item.longitude,
        lat: item.latitude,
        num: '',
        showPopup: 'false',
      }));
      const regionColds = Array.from(res.regionColds, (item) => ({
        ...item,
        markerId: item?.id,
        type: '冷链卡口',
        popupType: '',
        dataType: 'regionColds',
        lng: item?.longitude,
        lat: item?.latitude,
        num: '',
        showPopup: 'false',
      }));
      const data = [
        {
          markerId: 'beijing',
          lng: '116.38',
          lat: '39.9',
          type: '北京',
          num: '',
          popupType: '',
        },
        ...highSpeeds,
        ...regionColds,
      ].filter((item) => [...pointTypes, '北京'].includes(item.type));
      setCarOutMarkerData(data);
    } catch (error) {
      // message.error(error.message);
    }
  };
  const switchCheck = (val) => {
    setSelectType(val);
    getRoadPointPosition(val);
  };
  const getOutCitySupply = async () => {
    const data = await getOutCitySupplyData();
    const weight = data?.length > 0 ? data[0]?.weightCount : 0;
    data.forEach((el) => {
      /* eslint-disable*/
      const { center } = provinceCenters.filter(p =>  p.properties.name === el.province)?.[0].properties;
      Object.assign(el, {line: center, showFlyLine: false});
    });
    setMaxWeight(weight);
    setOutCitySupply(data);
  };

  const getOutCityGoodSupply = async (params) => {
    const data = await getOutCityGoodSupplyData(params);
    setOutCityGoodSupply(data);
  };

  const handleMarkerClick = async (item) => {
    if (item && item.type == '出发地') {
        let params = {
            goodsSourceAreaOut: item.province,
            startAddress: '',
          }
        const data = await getCarFromOutProvinceData(params);
        setCarListFromProvince(data)
        setIsShowCarFrom(true);
        // 将外省车辆的数据写入store
        Object.keys(item).length>0 && setCarFrom && setCarFrom(item?.province) && setZoom(6+Math.random())
    }
    
  };

  const getOutCityCarCount = async () => {
    const res = await getOutCityCarCountData();
    const data = [
      {
        title: '京外货车数量',
        num: res.carCount,
        unit: '辆',
      },
      {
        title: '冷链车数量',
        num: res.carChainCount,
        unit: '辆',
      },
      {
        title: '货车来源省份',
        num: res.carDependencyCount,
        unit: '个',
      },
    ];
    setOutCityCarCount(data);
  };

  const selectArea = (record) => {
    // gis.setCurRegion(record?.province);
  };

  const switchImage = (item) => {
    // item?.id &&
    //   item?.longitude &&
    //   item?.latitude &&
    //   setActiveMarkerInfo({
    //     ...item,
    //     markerId: item?.id,
    //     lng: item?.longitude,
    //     lat: item?.latitude,
    //     type: checkAllList[item?.businessType - 1]?.label,
    //     num: '',
    //     popupType: '',
    //     showPopup: 'false',
    //   });
    // setIsClickedPicture(true);
  };

  const closeTruckList = () => {
    setIsShowCarFrom('');
  }
  
    // 地图图例图标点击回调
    const changeLegend = (value) => {
        setCheckboxStatus(value);
    }

  useEffect(()=>{
    const markerData = Array.from(outCitySupply, item => ({
      ...item,
      markerId: item?.province,
      lng: item?.line?.[0],
      lat: item?.line?.[1],
      type: '出发地',
      num: '',
      popupType: '',
      showPopup: 'false',
    }));
    const isShowFlyLine = selectType.indexOf('物流线') >= 0;
    outCitySupply.forEach(el=>el.showFlyLine = isShowFlyLine);

    outCitySupply
      && outCitySupply.length > 0
        && carOutMarkerData
          && carOutMarkerData.length > 0
            && setMapData({markerData:[...markerData,...carOutMarkerData],flyLineData:outCitySupply});
    

         
  },[carOutMarkerData,outCitySupply]);
  useEffect(() => {
    getOutCitySupply();
    getRoadPointPosition();
    getOutCityCarCount();
   
    getCarOutTopSixImageOption(3);
    store.getTodaySupplyStatus({
      carDependency: '京外',
    });
    getSupplyFromPosition({
      goodsSourceAreaOut: '',
    });
    return ()=>{
      setCheckboxStatus(false);
      gis.setCurRegion && gis.setCurRegion(sessionStorage.getItem('area'))
    }
  }, []);

  const leftBtn = require(`@/assets/images/${theme}/left_normal.png`);
  const leftBtnActive = require(`@/assets/images/${theme}/left_active.png`);
  const rightBtn = require(`@/assets/images/${theme}/right_normal.png`);
  const rightBtnActive = require(`@/assets/images/${theme}/right_active.png`);
  
  return (
    <div className={styles.carOut_wrap}>
      <Markers
        zoom={zoom}
        // center={[105.536671, 37.682023]}
        activeArea={'全国'}
        markerData={mapData.markerData}
        flyLineData={{
            data:mapData.flyLineData,
            show:selectType.indexOf('物流线') >= 0
        }}
        changeLegend={changeLegend}
        showProvince={true}
        handleMarkerClick={handleMarkerClick}
        setCarFrom={setCarFrom}
        toolConfig={{show: true, right:positionIcon}}
        scaleConfig={{ status: true, bottom: '25px', right: scaleRight }}
      />
      {checkboxStatus && <div  className={styles.check_box}>
      <CheckBox defaultValue={selectType} data={checkList} setCheckBoxValue={switchCheck}   theme={theme}/>
    </div>}
      
      {isShowCarFrom ? <TruckList
        columns={truckColumns}
        dataSource={carListFromProvince}
        rowKey='id'
        styleType='carOut'
        options={{
          title: `来自于${carFromProvince}的货车清单`,
          canClose: true,
        }}
        style={{
          overflow: 'hidden auto'
        }}
        closeTable={closeTruckList}
        showMore={api.gotoShowMore}
      /> : null}
        <div className={`${styles.content_left} ${iframe ? styles.mobileP: ''}`}>
          <div className={`${styles.com_padding} ${showLeft ? styles.show : styles.hide}`}>
            <div className={styles.table_list_wrap}>
              <div className={styles.boxShadow}>
                <TableTab
                  columns={outCityColumns}
                  dataSource={outCitySupply}
                  options={{ title: '京外生活必需品进京情况' }}
                  rowKey='province'
                  selectRowChange={selectArea}
                />
              </div>
            </div>
          </div>
          <div className={styles.img_wrap}>
            <img onClick={showChange('left')} alt='' src={`${showLeft ? leftBtn : leftBtnActive}`} />
          </div>
        </div>
        <div className={`${styles.content_right_wrap}  ${iframe ? styles.mobileP: ''}`}>
          <div className={styles.img_wrap}>
            <img onClick={showChange('right')} alt='' src={`${showRight ? rightBtn : rightBtnActive}`} />
          </div>
          <div className={`${styles.com_padding} ${showRight ? styles.show : styles.hide}`}>
            <div className={styles.content_right}>
              <ImageTab option={carOutImageOption} switchImage={switchImage} />
              <div className={styles.card_outside_box}>
                <div className={styles.boxShadow}>
                  <Card title='近一周车辆运配情况' ext='' heightType={212}>
                    <div className={styles.card_content}>
                      {outCityCarCount.map(({ title, num, unit }) => {
                        return (
                          <div className={styles.item} key={title}>
                            <div className={styles.title}>{title}</div>
                            <div className={styles.num}>
                              {num}
                              <span className={styles.unit}>{unit}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                </div>
              </div>
              <div className={styles.card_outside_box}>
                <div className={styles.boxShadow}>
                  <TableTab
                    columns={goodSupplyColumns}
                    dataSource={store.todaySupplyStatus}
                    options={{ title: '近一周货物运配情况' }}
                    rowKey='goodsType'
                    heightType={310}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}

export default inject('gis')(observer(CarOut));
