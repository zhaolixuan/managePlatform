/* eslint-disable import/no-dynamic-require */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { observer, inject } from 'mobx-react';
import { Button, Modal } from '@jd/find-react';
import { assign } from 'lodash';
import { toJS } from 'mobx';
import JdProgress from '@/components/Progress';
import * as api from '@/api/gisOther';
import {
  getCarStatisticData,
  getCarAmountData,
  getTrainCompaniesData,
  getTrafficPermitCompaniesData,
  getOverviewData,
} from '@/api/carIn';
import Markers from '@/components/GisMap';
import Search from './components/Search';
import Chart from './components/Chart';
import Card from '@/components/Card';
import TruckList from '@/components/TruckList';
import ImageTab from '@/components/ImageTab';
import { useStore, useRouter } from '@/hooks';
import TableTab from '@/components/TableTab';
import CheckBox from '@/components/CheckBox';
import demo1CarOut from '@/assets/images/demo1_carOut.png';
import { checkList, checkItenList } from './config';
import styles from './index.module.less';

function CarIn({ gis }) {
  const [showLeft, setShowLeft] = useState(true);
  const [showRight, setShowRight] = useState(true);
  const [companyName, setCompanyName] = useState(null);
  // const [isModalVisible, setIsModalVisible] = useState(false);
  const [zoom, setZoom] = useState(8.8);
  const [updateCenter, setUpdateCenter] = useState(null);
  const [checkboxDefaultValue, setCheckboxDefaultValue] = useState(['8']);
  // const [carStatistic, setCarStatistic] = useState([]);
  const [_, forceUpdata] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [truckColumns, setTruckColumns] = useState(false);
  const store = useStore('carIn');
  const carStatistic = useRef([]);
  const [carAmount, setCarAmount] = useState([]);
  const [trainCompanies, setTrainCompanies] = useState([]);
  const [trafficPermitCompanies, setTrafficPermitCompanies] = useState([]);
  const [overView, setOverView] = useState([]);

  const checkListRef = useRef(checkList);
  const {
    query: { name, iframe },
  } = useRouter();

  const positionIcon = !iframe ? (showRight ? 386 : 22) : '760px';
  const scaleRight = !iframe ? (showRight ? '23%' : '4%') : '760px';

  const {
    setCurRegion,
    checkboxStatus,
    setCheckboxStatus,
    theme,
    activeMarkerInfo,
    setActiveMarkerInfo,
    markerStatus,
    setMarkerStatus,
    setIsClickedPicture,
    showTracksTable,
    setShowTracksTable,
    curRegion,
  } = useStore('gis');

  const statusColumns = [
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

  const closeTruckList = () => {
    store.setIsShowCarFrom('');
  };

  const switchCheck = (val) => {
    console.log(val);
    setCheckboxDefaultValue(val);
    store.getRoadPointPosition(val, curRegion === '北京' ? '' : curRegion);
  };

  const selectArea = async (record) => {
    getOverview({ area: record.area });
    getCarStatistic({ area: record.area });
    getTrainCompanies({ area: record.area });
    // getTrafficPermitCompanies({area: record.area})
    // store.setIsShowCarFrom(record.area);
    store.getRoadPointPosition(checkboxDefaultValue, record.area);
    console.log(record.area);
    setCurRegion(record.area);
  };

  const selectTrainCompany = async (record) => {
    // const truckColumns = [
    //   {
    //     title: '车牌号',
    //     dataIndex: 'licensePlateNumber',
    //     key: 'licensePlateNumber',
    //     width: '25%',
    //     ellipsis: true,
    //   },
    //   {
    //     title: '保障具体点位',
    //     dataIndex: 'guaranteePoint',
    //     key: 'guaranteePoint',
    //     align: 'left',
    //     ellipsis: true,
    //   },
    // ];
    // setTruckColumns(truckColumns)
    setCompanyName(record.companyName);
    store.setIsShowCarFrom(!record.area ? '北京市' : record.area);
    // store.getDirectInfoData({
    //     area: record?.area,
    //     companyName: record?.companyName?.trim(),
    // });
    console.log(record, '+++++===++++');
    const markerDetail = await store.enterpriseDetail({
      companyName: record?.companyName,
      area: curRegion === '北京' ? '' : curRegion,
    });

    setActiveMarkerInfo({
      ...markerDetail,
      // markerId: markerDetail?.id,
      type: 8,
      typeName: store?.checkList.filter((i) => i.value == 8)[0].label,
      popupType: 12,
      lng: markerDetail?.companyLongitude,
      lat: markerDetail?.companyLatitude,
      toolTip: markerDetail?.carPlate,
      deptType: markerDetail?.deptType === 0 ? '市属' : '区属',
      num: '',
    });
  };

  // 地图Marker点击回调
  const handleMarkerClick = async (item) => {
    const marker = {};
    if (item) {
      const markerDetail = await store.enterpriseDetail({
        companyName: item?.companyName,
        area: item?.area,
      });
      assign(marker, item, {
        ...markerDetail,
        type: 8,
        typeName: store?.checkList.filter((i) => i.value == 8)[0].label,
        popupType: 12,
        // lng: markerDetail?.companyLongitude,
        // lat: markerDetail?.companyLatitude,
        toolTip: markerDetail?.carPlate,
        num: '',
        showPopup: true,
        deptType: markerDetail?.deptType === 0 ? '市属' : '区属',
        id: item.id,
      });
    }
    setActiveMarkerInfo(marker);
  };

  const selectTrafficCompany = async (record) => {
    // const truckColumns = [
    //   {
    //     title: '车牌号',
    //     dataIndex: 'licensePlateNumber',
    //     key: 'licensePlateNumber',
    //     width:'25%,
    //     ellipsis: true,
    //   },
    //   {
    //     title: '车型',
    //     dataIndex: 'motorcycleType',
    //     key: 'motorcycleType',
    //     align: 'left',
    //     ellipsis: true,
    //   },
    // ];
    // setTruckColumns(truckColumns)
    setCompanyName(record.companyName);
    const markerDetail = await store.temporaryDetail({
      id: record?.id,
    });
    store.setIsShowCarFrom(!record.area ? '北京市' : record.area);
    console.log(markerDetail);
    setActiveMarkerInfo({
      ...markerDetail,
      markerId: markerDetail?.id,
      type: '京内临时通行证',
      popupType: 9,
      lng: markerDetail?.longitude,
      lat: markerDetail?.latitude,
      num: '',
      showPopup: '',
    });
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const getCarStatistic = async (row = { area: '' }) => {
    const res = await getCarStatisticData({ area: row.area });
    const x = Array.from(res, (item) => item?.sealingDate);
    const y1 = Array.from(res, (item) => item?.cityNumber);
    const y2 = Array.from(res, (item) => item?.districtNumber);
    const data = {
      area: !row.area ? '北京市' : row.area,
      legendData: ['市级派出（辆）', '区级派出（辆）'],
      data: {
        x,
        y1,
        y2,
      },
    };
    carStatistic.current = [data];
    if (carStatistic.current) forceUpdata({});
  };

  const getCarAmount = async () => {
    const data = await getCarAmountData();
    setCarAmount(data);
  };

  const getTrainCompanies = async (row = { area: '' }) => {
    const data = await getTrainCompaniesData({ area: row.area });
    // data.throughTrainCompanies.forEach(item => {
    //     item.area = row.area
    // })
    setTrainCompanies(data);
  };

  const getTrafficPermitCompanies = async (row = { area: '' }) => {
    const data = await getTrafficPermitCompaniesData({ area: row.area });
    data.trafficPermitCompanies.forEach((item) => {
      item.area = row.area;
    });
    setTrafficPermitCompanies(data);
  };

  const getOverview = async (row = { area: '' }) => {
    const data = await getOverviewData({ area: row.area });
    const area = !row.area ? '北京市' : row.area;

    setOverView({
      title: area + '保供车辆总览',
      desc: `${data.upTime}，${area}直通车派出车次：${
        !data.throughTrainCarNum ? 0 : data.throughTrainCarNum
      }辆，保障物资：${!data.goodsMaterialsNum ? 0 : data.goodsMaterialsNum}吨。
        截止${data.downTime}，市属在册蔬菜直通车企业数：${
        !data.cityThroughTrainCompanyNum ? 0 : data.cityThroughTrainCompanyNum
      }家；区属在册蔬菜直通车企业数：${
        !data.areaThroughTrainCompanyNum ? 0 : data.areaThroughTrainCompanyNum
      }家；市属蔬菜直通车车辆数：${
        !data.cityVegetableThroughTrainCarNum ? 0 : data.cityVegetableThroughTrainCarNum
      }辆；区属蔬菜直通车车辆数：${
        !data.areaVegetableThroughTrainCarNum ? 0 : data.areaVegetableThroughTrainCarNum
      }辆。`,
    });
  };

  useEffect(() => {
    // store.getTodaySupplyStatus({
    //   carDependency: '',
    // });
    // store.searchPointPosition();
    // store.getAreaAmount();
    // store.getAreaCarSupplyAmount();
    // store.getPoint();
    // store.getTopSixImageOption('3');
    store.getCheckBoxData(
      {
        parentCode: 'DICT_REGIONTYPE',
      },
      checkList,
      checkItenList,
    );
    getCarAmount(); //各行政区保供车辆统计
    let area = sessionStorage.getItem('area');
    getOverview({ area: area ? area : '' });
    getCarStatistic({ area: area ? area : '' });
    getTrainCompanies({ area: area ? area : '' });
    getTrafficPermitCompanies({ area: area ? area : '' });
    setUpdateCenter(new Date().getTime());
    return () => {
      store.setIsShowCarFrom(false);
      setCheckboxStatus(false);
      setCurRegion(sessionStorage.getItem('area'));
      setActiveMarkerInfo(null);
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      store.getRoadPointPosition(checkboxDefaultValue, curRegion === '北京' ? '' : curRegion);
    }, 500);
  }, [curRegion]);

  const shwoChange =
    (type = 'left') =>
    () => {
      type === 'left' ? setShowLeft(!showLeft) : setShowRight(!showRight);
    };

  const cilckTitle = async () => {
    setCurRegion('北京');
    setZoom(8);

    getCarStatistic();
    getOverview();
    getTrainCompanies();
    // getTrafficPermitCompanies()
    store.getRoadPointPosition(checkboxDefaultValue, curRegion === '北京' ? '' : curRegion);
  };

  // 地图图例图标点击回调
  const changeLegend = (value) => {
    setCheckboxStatus(value);
  };

  const carColumns = [
    {
      title: '行政区',
      dataIndex: 'area',
      key: 'area',
      width: '30%',
    },
    {
      title: '蔬菜直通车数',
      dataIndex: 'throughTrainCarNum',
      key: 'throughTrainCarNum',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '临时通行证车数',
      dataIndex: 'temporaryTrafficPermitCarNum',
      key: 'temporaryTrafficPermitCarNum',
      align: 'right',
      width: '40%',
    },
  ];

  const areaColumns = [
    {
      title: '企业名称',
      dataIndex: 'companyName',
      key: 'companyName',
      ellipsis: true,
    },
    {
      title: '直通车数量',
      dataIndex: 'throughTrainCarNum',
      key: 'throughTrainCarNum',
      align: 'center',
      width: '28%',
      // 100
    },
    {
      title: '所属范围',
      dataIndex: 'deptType',
      key: 'deptType',
      align: 'right',
      // 80
      width: '24%',
    },
  ];

  const temporaryColumns = [
    {
      title: '企业名称',
      dataIndex: 'companyName',
      key: 'companyName',
      ellipsis: true,
    },
    {
      title: '临时通行证数量',
      dataIndex: 'temporaryTrafficPermitNum',
      key: 'temporaryTrafficPermitNum',
      align: 'right',
      // 120
      width: '35%',
    },
  ];

  const leftBtn = require(`@/assets/images/${theme}/left_normal.png`);
  const leftBtnActive = require(`@/assets/images/${theme}/left_active.png`);
  const rightBtn = require(`@/assets/images/${theme}/right_normal.png`);
  const rightBtnActive = require(`@/assets/images/${theme}/right_active.png`);

  return (
    <div className={styles.carIn_wrap}>
      {console.log(toJS(store.markerData.markerData), 12343)}
      <Markers
        markerData={toJS(store.markerData.markerData)}
        // zoom={zoom}
        changeLegend={changeLegend}
        toolConfig={{ show: true, right: positionIcon }}
        activeMarker={activeMarkerInfo}
        handleMarkerClick={handleMarkerClick}
        // showMore={api.gotoShowMore}
        scaleConfig={{ status: true, bottom: '25px', right: scaleRight }}
        // zoomToolConfig={{ status: true, bottom: '20px', right: positionIcon }}
        // originToolConfig={{ status: true, bottom: '95px', right: positionIcon }}
        // dimensionToolConfig={{ status: true, bottom: '131px', right: positionIcon }}
        // themeToolConfig={{ status: true, bottom: '203px', right: positionIcon }}
        // checkboxToolConfig={{status: true, bottom: '167px', right: positionIcon}}
        // minZoom={7}
        // center={[116.38, 40.245999]}
        // updateCenter={updateCenter}
        activeArea={curRegion}
      />

      {checkboxStatus && store?.checkList.length && (
        <div className={styles.check_box}>
          <CheckBox
            defaultValue={checkboxDefaultValue}
            data={store?.checkList}
            setCheckBoxValue={switchCheck}
            theme={theme}
          />
        </div>
      )}

      {!iframe && (
        <div className={styles.search}>
          <Button type='primary' className={styles.btn_search} onClick={() => setIsModalVisible(true)}>
            临时通行证
          </Button>
        </div>
      )}

      {/* {store.isShowCarFrom ? (
          // <div className={styles.boxShadow}>
          <TruckList
            columns={truckColumns}
            dataSource={store.directInfoData || []}
            rowKey='id'
            styleType='carnIn'
            rowKey='licensePlateNumber'
            style={{
              width: 'max-content',
              maxWidth: 500,
              height: 400,
              position: 'absolute',
              right: 412,
              bottom: 352,
              boxShadow: ' 0px 4px 10px rgba(0, 20, 38, 0.15)',
              backdropFilter: 'blur(32px)',
              zIndex: 1000000
            }} 
            options={{
              title: `${companyName}`,
              canClose: true,
            }}
            closeTable={closeTruckList}
          />
          // </div>
        ) : null} */}
      <div className={`${styles.left} ${iframe ? styles.mobileP : ''}`}>
        <div className={`${styles.com_padding} ${showLeft ? styles.show : styles.hide}`}>
          <div className={styles.table_list_wrap}>
            <div className={styles.boxShadow}>
              <TableTab
                columns={carColumns}
                dataSource={carAmount || []}
                rowKey='area'
                heightType={968}
                options={{ title: '各行政区保供车辆统计' }}
                cilckTitle={cilckTitle}
                selectRowChange={selectArea}
              />
            </div>
          </div>
        </div>
        <div className={styles.img_wrap}>
          <img onClick={shwoChange('left')} alt='' src={`${showLeft ? leftBtn : leftBtnActive}`} />
        </div>
      </div>

      <div className={`${styles.right}  ${iframe ? styles.mobileP : ''}`}>
        <div className={styles.img_wrap}>
          <img onClick={shwoChange('right')} alt='' src={`${showRight ? rightBtn : rightBtnActive}`} />
        </div>

        <div className={`${styles.com_padding} ${showRight ? styles.show : styles.hide}`}>
          <div className={styles.right_wrap}>
            <div className={styles.card_outside_box}>
              <div className={styles.boxShadow}>
                <Card title={overView.title} ext='' heightType={163}>
                  <div className={styles.summary}>
                    <div>
                      <p>{overView.desc}</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
            {carStatistic.current.length &&
              carStatistic.current.map((item, index) => {
                return (
                  <div className={styles.card_outside_box}>
                    <div className={styles.boxShadow} key={index}>
                      <Chart
                        key={item?.area}
                        id={index}
                        theme={theme}
                        data={{
                          ...item.data,
                          legendData: item.legendData,
                          title: `${item.area}蔬菜直通车周统计`,
                          unit: '',
                        }}
                        // style={{ width: 360, height: 228 }}
                      />
                    </div>
                  </div>
                );
              })}
            <div className={styles.boxShadow}>
              <TableTab
                options={{ title: store?.checkList.filter((i) => i.value == 8)[0]?.label, unit: trainCompanies.count }}
                columns={areaColumns}
                dataSource={trainCompanies.throughTrainCompanies}
                heightType={250}
                rowKey='companyName'
                selectRowChange={selectTrainCompany}
              />
            </div>
            {/* <div className={styles.boxShadow}>
                    <TableTab
                      options={{ title: '临时通行证企业' ,unit:trafficPermitCompanies.count  }}
                      columns={temporaryColumns}
                      dataSource={trafficPermitCompanies.trafficPermitCompanies}
                      heightType={250}
                      rowKey='companyName'
                      selectRowChange={selectTrafficCompany}
                    />
                     </div> */}

            {/* <ImageTab option={store.imageOption} switchImage={switchImage} />
              <TableTab
                columns={statusColumns}
                dataSource={store.todaySupplyStatus}
                rowKey='goodsType'
                style={{
                  width: 352,
                  height: 340,
                  marginTop: 24,
                }}
                options={{
                  title: '近一周货物运配情况',
                  unit: '',
                }}
              /> */}
          </div>
        </div>
      </div>
      <Modal
        visible={isModalVisible}
        zIndex={10003}
        centered
        width='80%'
        bodyStyle={{
          minHeight: '700px',
          padding: 0,
          margin: 0,
        }}
        footer={null}
        sticky
        destroyOnClose
        wrapClassName={styles.userChartDialog}
        closable={false}
      >
        <div className='tabs_top'>
          <p className='title'>临时通行证名单</p>
          <img src={require('@/assets/images/solution_title_icon.png')} alt='' />
          <img
            onClick={() => setIsModalVisible && setIsModalVisible(false)}
            src={require('@/assets/images/clos_icon_night.png')}
            alt=''
          />
        </div>
        <img src={demo1CarOut} width='100%' height='100%' alt='' />
      </Modal>
    </div>
  );
}

export default inject('gis')(observer(CarIn));
