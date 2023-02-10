/* eslint-disable no-unused-vars */
import { useEffect, useMemo, useState, useRef } from 'react';
import _, { union, difference, set } from 'lodash';
import { observer, inject } from 'mobx-react';
import moment from 'moment';
import { Modal, Button, Dropdown, Menu, Space, Tabs, IconFont, Select, message } from '@jd/find-react';
import * as turf from '@turf/turf';
import { toJS } from 'mobx';
import { CaretDownOutlined, DownOutlined } from '@ant-design/icons';
import JdProgress from '@/components/Progress';
import { useStore, useRouter } from '@/hooks';
import { jsWakeUp } from '@/utils/util.js';
import Markers from '@/components/GisMap';
import Tab from './components/Tab';
import Total from './components/Total';
import ReturnOverview from './components/ReturnOverview';
import SupplySearch from './components/supplySearch';
import Chart from '@/components/Chart';
import TableList from '@/components/TableList';
import CheckBox from '@/components/CheckBox';
import TableTab from '@/components/TableTab';
import CarTableTab from './components/TableTab/index';
import TableDailog from './components/TableDialog';
import Ellipsis from '@/views/Gis/Markers/components/EllipsisSpan';
import styles from './Enclosure.module.less';
import {
  checkAllList,
  newCheckAllList,
  LOCK_DOWN,
  SUPPLY_GUARANTEE,
  menuList,
  CONTROL_TYPES,
  LOCK_DOWN_SOURCE_REGION_CONFIG,
  RADIUS_CONFIG,
  OVER_DESC,
  jingbansFormat,
  OVER_VIEW_CONFIG,
} from './config';
import * as api from '@/api/gisOther';
import { getCloseShops } from '@/api/carIn';
import OverView from './components/overView/index';
import MoreTableDialog from '@/components/ModalTabs';
import {
  getAmountCircleData,
  getWeekCountData,
  getWeekCircleAmountData,
  querySealingList,
  querySealingSealingType,
  siteDetails,
  carDetails,
  querySupportImgMappingList,
  staffDetails,
  queryStaffList,
  queryControl,
  queryRegionGuaranteed,
  queryOpenUserId,
  overInfo,
} from '@/api/enclosure';
import { getSiteLonLat, getStockoutWarning, siteDetails as picSiteDetail, orderQuantity } from '@/api/site';
import { getPointPositionData } from '@/api/carOut';

const { TabPane } = Tabs;

function Enclosure() {
  const {
    query: { iframe },
  } = useRouter();
  const {
    curRegion,
    activeMarkerInfo,
    setCurRegion,
    setActiveMarkerInfo,
    markerStatus,
    setMarkerStatus,
    setIsClickedPicture,
    enclosureCheckList,
    setEnclosureCheckList,
    theme,
    checkboxStatus,
    setCheckboxStatus,
  } = useStore('gis');
  const markVideoUrl = activeMarkerInfo?.videoUrl;
  const store = useStore('user');
  const sessionArea = sessionStorage.getItem('area');
  const [totalCount, setTotalCount] = useState({});
  const [weekCount, setWeekCount] = useState(null);
  const [weekCircleAmount, setWeekCircleAmount] = useState(null);
  const [sealingSealingType, setSealingSealingType] = useState(null);
  const [staffList, setStaffList] = useState(null);
  const [currArea, setCurrArea] = useState(curRegion);
  const [currLive, setLive] = useState(null);
  const [showControl, setShowControl] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [site, setSite] = useState(null);
  const [cars, setCars] = useState(null);
  const [staff, setStaff] = useState(null);
  const [radius, setRadius] = useState(1500);
  const [showLeftButton, setShowLeftButton] = useState(!iframe);
  const [showRightBtn, setShowRightBtn] = useState(!iframe);
  const [mapSealingData, setMapSealingData] = useState([]);
  const [closeShopsList, setCloseShopsList] = useState([]);
  const [checkboxDefaultValue, setCheckboxDefaultValue] = useState(['封控区', '管控区']);
  const [selectedType, setSelectedType] = useState(['封控区', '管控区']);
  const [buildingImage, setBuildingImage] = useState({});
  const [liveType, setLivedType] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisible1, setIsModalVisible1] = useState(false);
  const [isMoreModalVisible, setIsMoreModalVisible] = useState(false);
  const [isBaoGongModalVisible, setIsBaoGongModalVisible] = useState(false);
  const [overViewData, setOverViewData] = useState([]);
  const [modalDetail, setModalDetail] = useState({});
  const [zoneData, setZoneData] = useState([]);
  const [activeMenu, setActiveMenu] = useState({});
  const [zoom, setZoom] = useState(sessionArea ? 0 : 8.5);
  const [keyWordList, setKeyWordList] = useState([]);
  const [districtSites, setDistrictSites] = useState([]);
  const [stockoutWarning, setStockoutWarning] = useState([]);
  // 回到中心点
  const [updateCenter, setUpdateCenter] = useState(null);

  // 展示总览与（封控，保供）切换
  const [showOverview, setShowOverview] = useState(true);
  // 封控保供，切换
  const [controlType, setControlType] = useState(LOCK_DOWN);
  // 生活圈/配送圈半径
  const [radiusConfig, setRadiusConfig] = useState(RADIUS_CONFIG);
  // 封控/管控保障信息
  // const [guaranteeInfo, setGuaranteeInfo] = useState([]);
  // 保供一图一表传参
  const [guaranteeParams, setGuaranteeParams] = useState({ controlId: '', taskDelivery: '', taskLife: '' });
  // 保供一图一表是否显示设置参数按钮
  const [guaranteeBtn, setGuaranteeBtn] = useState(false);
  const [overDesc, setOverDesc] = useState(OVER_DESC);
  const [moreDiaLogDesc, setMoreDialogDesc] = useState({}); // 总览更多弹框弹框
  const [moreParams, setMoreParams] = useState({});
  const [activeZone, setActiveZone] = useState([]);
  const menuData = useRef([]); // 保供方案-下拉列表

  const center = !iframe ? [116.38, 40.245999] : [116.38, 39.645999];

  const handleVideo = async (records, phonekey) => {
    const { phone } = toJS(store?.userInfo) || {};
    if (!records?.[phonekey] || !phone) {
      !records[phonekey] && message.error('无呼叫电话号码！');
      !phone && message.error('登陆账号无电话号码！');
      return;
    }
    const openUseridInfo = await queryOpenUserId({
      phone: [phone, records?.[phonekey]],
    });
    const { openUserIds = [], teamAccessToken = '' } = openUseridInfo || {};
    if (!openUserIds || !Array.isArray(openUserIds) || !openUserIds.length || !teamAccessToken) {
      message.error('接口返回参数错误！');
      return;
    }
  
    jsWakeUp &&
      jsWakeUp(
        decodeURIComponent(
          encodeURIComponent(
            jingbansFormat({
              userid: openUserIds?.map((item) => item.openUserId)?.join(),
              token: teamAccessToken,
              select: 1,
              full: 1,
            }),
          ),
        ),
      );
  };
  const weekCircleColumns = [
    {
      title: '行政区',
      dataIndex: 'area',
      key: 'area',
      align: 'center',
    },
    {
      title: '高风险区数量',
      dataIndex: 'plotCount',
      key: 'plotCount',
      render: (text, item) => (
        <div className={styles.progress}>
          <JdProgress
            percent={(100 * item.plotCount) / item.totalCount}
            steps={28}
            size='small'
            showInfo={false}
            theme={theme}
          />
          <span>{text}</span>
        </div>
      ),
      width: '45%',
    },
    {
      title: '周环比',
      dataIndex: 'weekPercentum',
      key: 'weekPercentum',
      align: 'right',
      render: (text, records) => {
        return (
          <>
            {records.weekPercentum}%
            <span
              className={`${styles.weekIcon} ${
                records.weekPercentum < 0
                  ? `${styles.iconDown}`
                  : records.weekPercentum > 0
                  ? `${styles.iconUp}`
                  : `${styles.iconNone}`
              }`}
            ></span>
          </>
        );
      },
      width: '30%',
    },
  ];
  const areaColumns = [
    {
      title: '行政区',
      dataIndex: 'area',
      key: 'area',
      width: '25%',
      align: 'center',
    },
    {
      title: '区域名称',
      dataIndex: 'liveName',
      key: 'liveName',
      render: (res, record) => {
        const { videoUrl } = record;
        return (
          <div>
            {videoUrl && <IconFont type='iconwebcam-Lined' style={{ marginRight: '3px' }} />}
            <Ellipsis title={res} limit={32} wrapperTagName={styles.imageTitle} />
          </div>
        );
      },
      // ellipsis: true,
    },
  ];
  const siteColumns = [
    {
      title: '场所',
      dataIndex: 'businessName',
      key: 'businessName',
      ellipsis: true,
    },
    {
      title: '联系方式',
      dataIndex: 'contactNumber',
      key: 'contactNumber',
      width: '35%',
    },
    {
      title: '操作',
      dataIndex: 'opt',
      key: 'opt',
      width: '30%',
      align: 'center',
      render: (_text, records) => (
        <div className={styles.operate}>
          <div
            onClick={() => {
              // setModalDetail(records);
              // setIsModalVisible(true);
              handleMarkerClick(records);
            }}
          >
            查看
          </div>
          <div
            className={styles.videoCall}
            onClick={() => {
              handleVideo(records, 'contactNumber');
            }}
          ></div>
        </div>
      ),
    },
  ];
  const staffColumns = [
    {
      title: '姓名',
      dataIndex: 'staffName',
      key: 'staffName',
      // width: 70,
      width: '19.9%',
    },
    {
      title: '类型',
      dataIndex: 'status',
      key: 'status',
      // width: 70,
      width: '19.9%',
    },
    {
      title: '联系方式',
      dataIndex: 'staffNumber',
      key: 'staffNumber',
      // width: 90,
      width: '25.5%',
    },
    {
      title: '操作',
      dataIndex: 'opt',
      key: 'opt',
      // width: 60,
      width: '17%',
      align: 'center',
      render: (_text, records) => (
        <div className={styles.operate}>
          <div
            onClick={() => {
              // setModalDetail(records);
              // setIsModalVisible(true);
              setActiveMarkerInfo(records);
            }}
          >
            查看
          </div>
          <div
            className={styles.videoCall}
            onClick={() => {
              handleVideo(records, 'staffNumber');
            }}
          ></div>
        </div>
      ),
    },
  ];
  const carColumns = [
    {
      title: '区域',
      dataIndex: 'area',
      key: 'area',
      // width: 70,
      width: '19.9%',
    },
    {
      title: '保障点',
      dataIndex: 'communityName',
      key: 'communityName',
      ellipsis: true,
    },
    {
      title: '车牌号',
      dataIndex: 'carPlate',
      key: 'carPlate',
    },
    {
      title: '操作',
      dataIndex: 'opt',
      key: 'opt',
      // width: 60,
      width: '17%',
      align: 'center',
      render: (_text, records) => (
        <div
          onClick={() => {
            // setModalDetail(records);
            // setIsModalVisible(true);
            setActiveMarkerInfo(records);
          }}
        >
          查看
        </div>
      ),
    },
  ];

  const getSupportImgMappingList = async () => {
    const images = await querySupportImgMappingList({ type: 4 });
    setBuildingImage(images);
  };
  const getAmountCircle = async () => {
    // const data = await getAmountCircleData({ area: currArea === '北京市' ? '' : currArea });
    const data = await getAmountCircleData({ area: currArea === '北京市' || currArea === '北京' ? '' : currArea });
    setTotalCount(data);
  };

  const getWeekCircleAmount = async () => {
    // const data = await getWeekCircleAmountData({ area: currArea === '北京市' ? '' : currArea });
    const data = await getWeekCircleAmountData({ area: currArea === '北京市' || currArea === '北京' ? '' : currArea });
    let max = 0;
    data.sort((a, b) => {
      max = Math.max(a.plotCount, max);
      return b.plotCount - a.plotCount;
    });
    data.forEach((el) => {
      Object.assign(el, { totalCount: max });
    });
    // setCurrArea(data?.[0].area);
    setWeekCircleAmount(data);
  };

  const getWeekCount = async () => {
    // const res = await getWeekCountData({ area: currArea === '北京市' ? '' : currArea });
    const res = await getWeekCountData({ area: currArea === '北京市' || currArea === '北京' ? '' : currArea });
    const x = Array.from(res, (item) => item.sealingDate);
    const y = Array.from(res, (item) => item.plotCount);

    setWeekCount({ x, y });
  };

  // 获取风控区管控区数据（散点信息）
  const getSealingSealingType = async () => {
    const data = await querySealingSealingType({ area: curRegion === '北京市' ? '' : curRegion });
    const imglist = [];
    data?.forEach((el) => {
      /* eslint-disable */
      el.areaName = el.areaName?.map((live) => {
        return {
          ...live,
          markerId: live?.id,
          lng: live?.longitude && live.longitude.toString().replace(',', ''),
          lat: live?.latitude,
          type: el?.sealingName,
          sealingType: el?.sealingName,
          num: '',
          showPopup: 'false',
          popupType: !!live?.polygon ? 6 : 4,
          polygon: !!live?.polygon ? JSON.parse(live.polygon) : null,
        };
      });
      // 取得过滤小区图片
      el.sealingName === '封控区' &&
        el.areaName?.forEach((live, idx) => {
          if (imglist.length < 2) {
            imglist.push({ title: live.liveName, url: buildingImage?.[idx % 2]?.url, ...live });
          }
        });
    });
    // const images = {
    //   tabTitle: '封控小区视频/图片',
    //   imageTitle: '最新封控小区',
    //   hasHead: true,
    //   hasTextImage: false,
    //   imageList: imglist,
    // };
    // setImageTabOption(images);
    setSealingSealingType(data);
  };

  const fengkongArea = async (liveName) => {
    const res = await querySealingList({ liveName });
    const data = res?.map((item) => {
      return {
        ...item,
        markerId: item?.id,
        zoneId: item?.polygon ? item?.id : '',
        lng: item?.longitude,
        lat: item?.latitude,
        type: item?.sealingType,
        num: '',
        popupType: !!item?.polygon ? 6 : 4,
        polygon: !!item?.polygon ? JSON.parse(item.polygon) : null,
      };
    });
    setKeyWordList(data);
    // console.log(res, "+++===+++");
  };

  const queryStockoutWarning = async (radius) => {
    // const params = {
    //   latitude: currLive.lat,
    //   longitude: currLive.lng,
    //   radius
    // };
    const res = await getStockoutWarning();
    const data = res.map((item) => ({
      ...item,
      ...item?.supportReplenishmentSupplyChainVO,
      markerId: item?.id,
      type: '缺补货',
      popupType: 11,
      lng: item?.longitude,
      lat: item?.latitude,
      num: '',
    }));
    setStockoutWarning(data);
  };

  const getCloseShopsList = async (radius) => {
    if (!currLive) return;
    const params = {
      latitude: currLive.lat,
      longitude: currLive.lng,
      radius,
      id: currLive?.polygon || undefined,
    };
    const res = await getCloseShops(params);
    const closeShops = res.map((item) => ({
      ...item,
      markerId: item?.id,
      type: '关停门店',
      popupType: '7',
      lng: item?.shopLongitude,
      lat: item?.shopLatitude,
      num: '',
    }));
    setCloseShopsList(closeShops);
  };
  const getDistrictSitesList = async (radius) => {
    if (!currLive) return;
    const params = {
      latitude: currLive.lat,
      longitude: currLive.lng,
      radius,
      id: currLive?.polygon || undefined,
    };
    const res = await queryRegionGuaranteed(params);
    const data = res.map((item) => ({
      markerId: item?.id,
      type: '区级保供场所',
      popupType: 10,
      lng: item?.longitude,
      lat: item?.latitude,
      ...item,
    }));
    setDistrictSites(data);
  };

  const getOverViewData = (area = '') => {
    // const res = await queryChart();
    // let data = {}
    // if(area) {
    //   data = res?.statisticals?.filter(item => {
    //     return item.area === area
    //   })[0]
    // } else { // 全北京
    //   // res?.statisticals?.push({ ...res.statistical, disabled: true });
    //   data = res.statistical
    // }
    // setOverViewData(OVER_VIEW_CONFIG(data))
    getOverInfo(area);
    setMoreParams(area ? { area } : {});
  };

  const queryPointPositionData = async () => {
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
    setHighway(highSpeeds);
    setColdChain(regionColds);
  };

  const getControlData = async () => {
    await queryControl({ id: currLive.id }).then(
      ({ listCarInfoVO, listPersonnelOnlyVo, listCloseVo, listAreaRegionVo, listRegionVo, listReplenishmentVo }) => {
        const districtSites = listAreaRegionVo?.map((item) => ({
          markerId: item?.id,
          type: '区级保供场所',
          popupType: 10,
          lng: item?.longitude,
          lat: item?.latitude,
          ...item,
        }));
        // const replenishments = listReplenishmentVo?.map((item)=>({
        //   ...item,
        //   ...item?.supportReplenishmentSupplyChainVO,
        //   markerId: item?.id,
        //   type: '缺补货',
        //   popupType: 11,
        //   lng: item?.longitude,
        //   lat: item?.latitude,
        //   num: '',
        // }))
        let site =
          listRegionVo?.map((item) => {
            return {
              ...item,
              markerId: item?.id,
              lng: item?.longitude,
              lat: item?.latitude,
              businessType: 7,
              type: '7',
              num: '',
              popupType: 1,
              dataSource: '封控区保供',
              showPopup: 'false',
            };
          }) || [];
        // site.push.apply(site,replenishments)
        // site.push.apply(site,districtSites)
        setSite(site);
        setDistrictSites(districtSites);

        const cars = listCarInfoVO?.map((item) => {
          return {
            ...item,
            markerId: item?.id,
            lng: item?.communityLongitude,
            lat: item?.communityLatitude,
            type: '出发地',
            num: '',
            popupType: 8,
          };
        });
        setCars(cars);

        const staff = listPersonnelOnlyVo?.map((item) => {
          return {
            ...item,
            markerId: item?.id,
            lng: item?.longitude,
            lat: item?.latitude,
            status: item?.type,
            type: '人员',
            num: '',
            popupType: 2,
          };
        });
        setStaff(staff);
        setStaffList(staff);

        const closeShop = listCloseVo?.map((item) => ({
          ...item,
          markerId: item?.id,
          type: '关停门店',
          popupType: '7',
          lng: item?.shopLongitude,
          lat: item?.shopLatitude,
          num: '',
        }));
        setCloseShopsList(closeShop);
      },
    );
  };

  const getSiteDetails = async (radius) => {
    if (!currLive) return;
    const params = {
      latitude: currLive.lat,
      longitude: currLive.lng,
      radius,
      id: currLive?.polygon || undefined,
    };
    siteDetails(params).then((res) => {
      console.log(toJS(res), '+++==1==+++');
      const data = res?.map((item) => {
        return {
          markerId: item?.id,
          lng: item?.longitude,
          lat: item?.latitude,
          type: item?.businessType+'',
          num: '',
          popupType: 1,
          ...item,
          dataSource: '封控区保供',
          showPopup: 'false',
        };
      });
      console.log(toJS(data), '+++==2==+++');
      setSite(data);
    });
  };
  const getSiteList = async () => {
    const types = [1, 2, 3, 4, 5, 6, 7, 8];
    /* eslint-disable  */
    for (const [key, value] of Object.entries(siteType)) {
      if (selectedType.indexOf(value) >= 0) {
        types.push(key);
      }
    }
    // console.log('currArea',currArea);
    await getSiteLonLat({
      businessTypes: types,
      businessName: '',
      area: currArea === '北京市' ? '' : currArea,
    }).then((res) => {
      // console.log(res, '+++==1==+++');
      const resData = res?.map((item) => {
        return {
          markerId: item?.id,
          lng: item?.longitude,
          lat: item?.latitude,
          type: item?.typeName || siteType[item?.businessType],
          markerType: item?.typeName || siteType[item?.businessType],
          num: '',
          popupType: 1,
          ...item,
          url: '',
          dataSource: '封控区保供',
        };
      });
      setSite(resData);
    });
  };
  const getCarDetails = async (radius) => {
    if (!currLive) return;
    const params = {
      latitude: currLive?.lat,
      longitude: currLive?.lng,
      radius,
      id: currLive?.polygon || undefined,
    };
    carDetails(params).then((res) => {
      const data = res?.map((item) => {
        return {
          ...item,
          markerId: item?.id,
          lng: item?.communityLongitude,
          lat: item?.communityLatitude,
          type: '出发地',
          num: '',
          popupType: 8,
        };
      });
      setCars(data);
    });
  };
  const getAllStaff = async () => {
    const params = {
      area: currArea === '北京市' ? '' : currArea,
    };
    queryStaffList(params).then((res) => {
      const data = res?.map((item) => {
        return {
          ...item,
          markerId: item?.id,
          lng: item?.longitude,
          lat: item?.latitude,
          status: item?.type,
          type: '人员',
          num: '',
          popupType: 2,
        };
      });
      setStaffList(data);
      setStaffList(data);
    });
  };
  const getStaff = async (radius) => {
    const params = {
      latitude: currLive?.lat,
      longitude: currLive?.lng,
      radius,
      id: currLive?.polygon || undefined,
    };
    staffDetails(params).then((res) => {
      const data = res?.map((item) => {
        return {
          ...item,
          markerId: item?.id,
          lng: item?.longitude,
          lat: item?.latitude,
          status: item?.type,
          type: '人员',
          num: '',
          popupType: 2,
        };
      });
      setStaff(data);
      setStaffList(data);
    });
  };

  const mapDataHandle = () => {
    const data = [];
    const index = selectedType && selectedType.length > 0 ? [...selectedType] : [];
    if (index.indexOf('配送人员') >= 0) {
      index.push('人员');
    }
    if (index.indexOf('连锁超市门店') >= 0) {
      index.push('7');
    }
    if (index.indexOf('车辆') >= 0) {
      index.push('出发地');
    }
    data.push.apply(data, stockoutWarning);
    selectedType?.length > 0 && data.push.apply(
      data,
      site?.filter((el) => index.indexOf(el.type) >= 0),
    );
    selectedType?.length > 0 && data.push.apply(
      data,
      staffList?.filter((el) => index.indexOf(el.type) >= 0),
    );
    selectedType?.length > 0 && data.push.apply(
      data,
      closeShopsList?.filter((el) => index.indexOf(el.type) >= 0),
    );
    selectedType?.length > 0 && data.push.apply(
      data,
      districtSites?.filter((el) => index.indexOf(el.type) >= 0),
    );
    selectedType?.length > 0 && data.push.apply(data, cars?.filter((el) => index.indexOf(el.type) >= 0));
    // 各区数据在类型数据的areaName里
    selectedType?.length > 0 && sealingSealingType?.forEach((el) => {
      if (index.indexOf(el.sealingName) >= 0) {
        data.push.apply(data, el.areaName);
      }
    });
    console.log(sealingSealingType,'sealingSealingType');
    setMapSealingData(data);
  };

  const getRadius = (liveType, center, area) => {
    const areaPoints = [];
    area?.features?.forEach((el) => {
      areaPoints.push.apply(areaPoints, el.geometry?.coordinates?.[0]);
    });
    const baseRadius = liveType % 2 === 1 ? radiusConfig.lifeRadius : radiusConfig.deliverRadius;
    let min = 0;
    let max = 0;
    baseRadius > 0 &&
      areaPoints?.map((point) => {
        const d = Math.abs(turf.distance(center, point, { units: 'miles' }));
        // min = Math.min(min, d);
        // max = Math.max(max, d);
        min = 0;
        max = 0;
      });
    return baseRadius + max * 1000;
  };

  const getZoneArr = (row, type) => {
    let arr = [];
    if (type === 1) {
      // 生活
      arr = [{ type: 'life', center: [+row.lng, +row.lat], radius: radiusConfig.lifeRadius }];
    } else if (type === 2) {
      // 配送
      arr = [{ type: 'send', center: [+row.lng, +row.lat], radius: radiusConfig.deliverRadius }];
    }
    if (row?.polygon && row?.polygon !== 'null') {
      const data = typeof row?.polygon === 'string' ? JSON.parse(row?.polygon) : row.polygon;
      arr.push({ type: 'zone', data: data.features[0] });
    }
    return arr;
  };
  const selectRowChange = async (row) => {
    console.log('row?.sealingType', row?.sealingType, row);
    setShowOverview(true);
    // setMoreArea(row.area)
    getOverViewData(row.area);
    if (row?.sealingType) {
      setRadiusConfig(RADIUS_CONFIG);
      setShowOverview(false);
      setDistrictSites(); // 清空区级保供场所，区级保供场所与小区不关联，仅与行政区关联
      setLive(row);
      setActiveZone(getZoneArr(row, row?.polygon && row?.polygon !== 'null' ? 3 : 1));
      // setActiveZone([{type:'zone',data:[[+row.lng,+row.lat]]},{type:'life', center:[+row.lng, +row.lat], radius:1500},{type:'send', center:[+row.lng, +row.lat], radius:3000}])
      setMarkerStatus(!markerStatus);
      setIsClickedPicture(true);
      setActiveMarkerInfo(row);
      setShowDetail(true);
      setShowControl(!!row?.polygon);
      const liveT = !!row?.polygon ? 3 : 1;
      const radius = getRadius(liveT, [+row.lng, +row.lat], row.polygon);
      console.log(radius, row, '区域radius');
      setRadius(radius);
      setLivedType(liveT);
    } else if (row?.area) {
      setShowDetail(false);
      setRadiusConfig(RADIUS_CONFIG);
      setLive();
      setSite([]);
      setCars([]);
      setStaff([]);
      setStaffList([]);
      setDistrictSites([]);
      setCloseShopsList([]);
      // setStockoutWarning([]);
      setRadius(0);
      setLivedType(0);
      console.log(1);
      setCurrArea(row.area);
      setCurRegion(row.area);
      setShowOverview(true);
    }
  };

  const tabHandleSelect = (tabIndex) => {
    const radius = getRadius(tabIndex, [currLive.lng, currLive.lat], currLive.polygon);
    setRadius(radius);
    setLivedType(tabIndex);
    setActiveZone([]);
    setActiveZone(getZoneArr(currLive, tabIndex));
  };

  const tabHandleClose = () => {
    setShowDetail(false);
    setSite([]);
    setCars([]);
    setStaff([]);
    setStaffList([]);
    setDistrictSites([]);
    setCloseShopsList([]);
    // setStockoutWarning([]);
    setLivedType(0);
    // getAllStaff();
    // getSiteList();
  };

  const handleBtnClick = (pannel, extend) => {
    if (pannel === 'right') {
      setShowRightBtn(extend);
    }
    if (pannel === 'left') {
      setShowLeftButton(extend);
      setShowDetail(false);
    }
  };
  // 多选框事件
  const changeCheck = (values) => {
    setSelectedType(values);
  };

  const selectImage = (obj) => {
    setLive(obj);
  };

  const cilckTitle = () => {
    // console.log('cilckTitle');
    setShowDetail(false);
    setLivedType(0);
    setRadius(0);
    setActiveMarkerInfo();
    setZoom(8);
    setSite([]);
    setCars([]);
    setStaff([]);
    setStaffList([]);
    setDistrictSites([]);
    setCloseShopsList([]);
    // setStockoutWarning([]);
    console.log(2);
    setCurrArea(null);
    setLive();
    // setUpdateCenter(new Date().getTime());
    setCurRegion('');
    setShowOverview(true);
    getOverViewData();
  };

  // // 地图选中点击回调
  // const clickMarkerCallback = (params = {}) => {
  //   if (!params || params.id === currLive?.id || !params.sealingType)
  //     return;

  //   const data = toJS(params)
  //   setShowDetail(true);
  //   const liveT = !!data?.polygon && data?.polygon !== 'null' ? 3 : 1;
  //   const radius = getRadius(liveT, [+data.lng, +data.lat], data.polygon);
  //   data?.lng && data?.lat && setLive(data);
  //   setLive({...data, polygon: data.polygon && typeof data.polygon === 'string'? JSON.parse(data.polygon): data.polygon});
  //   setLivedType(data?.lng && data?.lat ? liveT : 0);
  //   setShowControl(!!data?.polygon && data?.polygon !== 'null');
  //   setRadius(radius);
  //   setShowOverview(false); // 切换到管控封控
  //   setControlType(LOCK_DOWN); // 切换到封管控点
  //   setActiveMarkerInfo({...data, polygon: data.polygon && typeof data.polygon === 'string'? JSON.parse(data.polygon): data.polygon})
  // };

  const lockDownSource = useMemo(() => {
    const { popupType } = currLive || {};
    let data = [];
    if (popupType === 4 || popupType === 6) {
      console.log(currLive, 'activeMarkerInfoactiveMarkerInfoactiveMarkerInfo');
      data = LOCK_DOWN_SOURCE_REGION_CONFIG(currLive);
    }
    return data;
  }, [currLive]); // 改为监听页面变量，因为activeMarker可能是非封管控区数据

  // 地图Marker点击回调
  const handleMarkerClick = async (params) => {
    if (!params || params.id === currLive?.id) return;
    if (params.type === '封控区' || params.type === '管控区') {
      const data = toJS(params);
      setShowDetail(true);
      const liveT = !!data?.polygon && data?.polygon !== 'null' ? 3 : 1;
      const radius = getRadius(liveT, [+data.lng, +data.lat], data.polygon);
      data?.lng && data?.lat && setLive(data);
      setLive({
        ...data,
        polygon: data.polygon && typeof data.polygon === 'string' ? JSON.parse(data.polygon) : data.polygon,
      });
      setActiveZone(getZoneArr(data, data?.polygon && data?.polygon !== 'null' ? 3 : 1));
      setLivedType(data?.lng && data?.lat ? liveT : 0);
      setShowControl(!!data?.polygon && data?.polygon !== 'null');
      setRadius(radius);
      setShowOverview(false); // 切换到管控封控
      setControlType(LOCK_DOWN); // 切换到封管控点
      setActiveMarkerInfo({
        ...data,
        polygon: data.polygon && typeof data.polygon === 'string' ? JSON.parse(data.polygon) : data.polygon,
      });
    }

    console.log('Params0', params);

    if (params.popupType === 1) {
      const marker = {};
      const indentNum = await orderQuantity({
        latitude: params.lat,
        longitude: params.lng,
      });
      // const { pictureDetails } = await picSiteDetail(params.id)
      // Object.assign( marker, params,{indentNum, pictureDetails: pictureDetails, showMore:function(){api.gotoShowMore(params)}, showPopup: 'true'})
      // 表格行数据不全 需要拿接口里所有的数据
      const res = await picSiteDetail(params.id);
      Object.assign(marker, params, {
        ...res,
        indentNum,
        pictureDetails: res.pictureDetails,
        showMore: function () {
          api.gotoShowMore(params);
        },
        showPopup: 'true',
      });
      console.log('params', marker);

      setActiveMarkerInfo(marker);
    }
  };

  // 地图图例图标点击回调
  const changeLegend = (value) => {
    setCheckboxStatus(value);
  };

  // 封/管控小区列表、地图图例、场所数据、人员数据、车辆数据、区保供场所数据变化时处理地图上要显示的数据
  useEffect(() => {
    mapDataHandle();
  }, [
    sealingSealingType,
    selectedType,
    site,
    staffList,
    cars,
    districtSites,
    closeShopsList,
    stockoutWarning,
    currArea,
  ]);

  // 点击封/管控小区时请求详情
  useEffect(() => {
    // liveType === 3 区域
    // currLive 当前小区，有面坐标，并且是管控圈
    if (showDetail && !!currLive?.polygon && liveType === 3) {
      getControlData();
      setActiveZone(getZoneArr(currLive, 3));
    } else if (showDetail && liveType > 0 && liveType !== 3) {
      // 生活圈 配送圈

      const radius = getRadius(liveType, [+currLive.lng, +currLive.lat], currLive.polygon);
      if (radius === 0) {
        setSite([]);
        setCars([]);
        setStaff([]);
        setStaffList([]);
        setDistrictSites([]);
        setCloseShopsList([]);
        setStockoutWarning([]);
      } else {
        setActiveZone(getZoneArr(currLive, liveType));
        getSiteDetails(radius);
        getCarDetails(radius);
        getStaff(radius);
        getCloseShopsList(radius); // 关闭门店
        getDistrictSitesList(radius); // 区级保供
        // queryStockoutWarning(radius); // 缺补货
      }
      setRadius(radius);
    }
  }, [currLive, liveType, radiusConfig]);

  // 显示总览时清空数据
  useEffect(() => {
    if (showOverview) {
      setActiveMarkerInfo();
      setLive();
      setRadius(0);
      setLivedType(0);
      setShowDetail(false);
      setSite([]);
      setCars([]);
      setStaff([]);
      setStaffList([]);
      setDistrictSites([]);
      setCloseShopsList([]);
      setActiveZone([]);
      // setStockoutWarning([]);
      changeCheckList(checkAllList);
    } else {
      changeCheckList(store?.newCheckAllList);
    }
  }, [showOverview]);
  // 图片数据请求后或者行政区切换后，地图上数据+右侧列表数据请求
  useEffect(() => {
    if (buildingImage && buildingImage.length > 0) {
      getSealingSealingType(); // 管控小区，小区总数
      setActiveMarkerInfo();
      getOverViewData(currArea);
      // fengkongArea();
      // getAllStaff(); // 配送人员
      // getSiteList(); // checkbox
      // getDistrictSitesList();
    }
  }, [buildingImage, currArea]);

  // 初始化数据
  useEffect(() => {
    // 如果默认登录后进入该页面，sessionStore里的area会滞后，导致area为null
    const menuListData = menuList.filter(
      ({ area = '' }) => !sessionArea || sessionArea === '北京市' || area === sessionArea,
    );
    setActiveMenu(!menuListData.length ? {} : menuListData[0]);
    menuData.current = menuListData;
    // setLive({lng:116.38, lat:40.245999});
    getSupportImgMappingList(); // 右侧图片
    getAmountCircle();
    getWeekCount();
    // queryPointPositionData(); // 地图卡扣，冷链卡口
    getWeekCircleAmount();
    // getCloseShopsList(); // 关闭门店
    // getDistrictSitesList(); // 区级保供
    queryStockoutWarning(); // 缺补货
    // setMoreArea(area)

    store.getCheckBoxData(
      {
        parentCode: 'DICT_REGIONTYPE',
      },
      newCheckAllList
    );

    return () => {
      setCheckboxStatus(false);
      setCurRegion(sessionStorage.getItem('area'));
      setActiveMarkerInfo();
    };
  }, []);

  const configCheckList = (checkList, checkedValues, nowAddValue, nowDelValue) => {
    const computedValue =
      nowAddValue.length > 0 ? union(checkedValues, nowAddValue) : difference(checkedValues, nowDelValue);
    setCheckboxDefaultValue(computedValue);
    changeCheck(computedValue);
    setEnclosureCheckList(checkList);
  };

  // 显示详情和不显示详情处理checkbox
  const changeCheckList = (list) => {
    let checkValues = list.map((item) => item.value);
    setCheckboxDefaultValue(checkValues);
    changeCheck(checkValues);
    setEnclosureCheckList(list);
  };

  const handleRefresh = (values) => {
    setRadiusConfig({
      lifeRadius: 1000 * values.lifeRadius,
      deliverRadius: 1000 * values.deliverRadius,
    });
  };

  const positionIcon = !iframe ? (showLeftButton ? 386 : 22) : '760px';
  const scaleRight = !iframe ? (showLeftButton ? '23%' : '4%') : '760px';

  const menu = (
    <Menu>
      {menuData.current?.map((item) => (
        <Menu.Item key={item.key} onClick={() => handleMenuClick(item)}>
          {item.title}
        </Menu.Item>
      ))}
    </Menu>
  );

  const handleMenuClick = (item) => {
    if (item.href) {
      // 外链
      const win = window.open('about:blank');
      win.location.href = item.href;
      return;
    }
    setActiveMenu(item);
    setIsModalVisible1(true);
  };

  const changeTabs = (key) => {
    // console.log(key);
  };

  let timer = null;
  const onSearch = (value) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fengkongArea(value);
      timer = null;
    }, 300);
  };

  const changeSelect = async (value) => {
    // console.log('Enclosure changeSelect', value);
    // console.log(toJS(JSON.parse(value)), '街道搜索')
    // setActiveMarkerInfo(toJS(JSON.parse(value)));
    let obj = JSON.parse(value);
    const data = await querySealingSealingType({ liveName: obj.liveName });
    data?.forEach((el) => {
      /* eslint-disable */
      el.areaName = el.areaName?.map((live) => {
        return {
          ...live,
          markerId: live?.id,
          lng: live?.longitude && live.longitude.toString().replace(',', ''),
          lat: live?.latitude,
          type: el?.sealingName,
          sealingType: el?.sealingName,
          num: '',
          showPopup: 'false',
          popupType: !!live?.polygon ? 6 : 4,
          polygon: !!live?.polygon ? JSON.parse(live.polygon) : null,
        };
      });
    });
    const info = data[0].areaName[0];
    selectRowChange(info);
  };

  const showIsMoreModalVisible = () => {
    // setMoreParams({ id: '2647'})
    console.log(moreParams, 'moreParamsmoreParamsmoreParamsmoreParams');
    setIsMoreModalVisible(true);
  };

  // 查看一图一表
  const showBaoGongModalVisible = () => {
    let params = { controlId: currLive.id, deliveryRadius: 3000, liftRadius: 1500 };
    console.log(params, 'paramsparamsparams');
    setGuaranteeParams(params);
    setIsBaoGongModalVisible(true);
    setGuaranteeBtn(false);
  };

  // 生成一图一表
  const generateBaoGong = () => {
    let params = {
      controlId: currLive.id,
      deliveryRadius: radiusConfig.deliverRadius,
      liftRadius: radiusConfig.lifeRadius,
    };
    console.log(params, 'paramsparamsparamsparams');
    setGuaranteeParams(params);
    setIsBaoGongModalVisible(true);
    setGuaranteeBtn(true);
  };

  // 获取总览详情
  const getOverInfo = async (area) => {
    let params = {
      overviewArea: area,
      overviewDate: moment().format('YYYY-MM-DD HH:ss:mm'),
    };
    let data = await overInfo(params);
    setTimeout(() => {
      // 避免多次执行该func，后返回的data覆盖前面返回的
      data['area'] = area ? area : '北京市';
      data['time'] = moment().format('YYYY-MM-DD');
      console.log(data, area, 'dataratatta');
      setOverViewData(OVER_VIEW_CONFIG(data));
      setMoreDialogDesc(data);
      setOverDesc(OVER_DESC(data['area'], data));
    }, 100);
  };

  const sealingSealing = () => {
    // const sealingSealingList = sealingSealingType.length ? sealingSealingType : emptySealingSealing;
    let sealingSealingList = []
    if(sealingSealingType.length){
      if(sealingSealingType.length == 1){
        sealingSealingList =  sealingSealingType[0].sealingName == "封控区" ? sealingSealingType.concat([{
          "plotCount": 0,
          "sealingName": '管控区',
          "areaName": []
        }]): [{
          "plotCount": 0,
          "sealingName": '封控区',
          "areaName": []
        }].concat(sealingSealingType)
      }else{
        sealingSealingList = sealingSealingType
      }
    }else{
      sealingSealingList = emptySealingSealing
    }
    console.log(sealingSealingList,'=========');
    return (
      <>
        {sealingSealingList.map((el, idx) => (
          // <div className={styles.boxShadow}>
          <div className={styles.boxShadow} key={`div${el.sealingName}`}>
            <TableTab
              key={`${el.sealingName}`}
              title={el.sealingName == "管控区"?'中风险区':'高风险区'}
              columns={areaColumns}
              dataSource={el.areaName}
              heightType={250}
              rowKey='id'
              selectRowChange={selectRowChange}
              options={{ title: el.sealingName == "管控区"?'中风险区':'高风险区', unit: el.plotCount }}
            />
          </div>
          // </div>
        ))}
      </>
    )
  }
  // 高中风险为空时
  const emptySealingSealing = [
      {
        "plotCount": 0,
        "sealingName": "封控区",
        "areaName": []
      },
      {
        "plotCount": 0,
        "sealingName": "管控区",
        "areaName": [ ]
      }
  ]

  useEffect(() => {
    setCurrArea(curRegion);
  }, [curRegion]);

  // useEffect(() => {
  //   getSealingSealingType(curRegion);
  // }, [curRegion])

  return (
    <div className={styles.enclosure_wrap}>
      <Markers
        activeArea={curRegion}
        markerData={mapSealingData}
        handleMarkerClick={handleMarkerClick}
        activeMarker={activeMarkerInfo}
        activeZone={activeZone}
        changeLegend={changeLegend}
        toolConfig={{ show: true, right: positionIcon }}
        // data={mapSealingData}
        // zoneData={zoneData}
        // zoom={zoom}
        // showMore={api.gotoShowMore}
        scaleConfig={{ status: true, bottom: '25px', right: scaleRight }}
        // zoomToolConfig={{ status: true, bottom: '20px', right: positionIcon }}
        // originToolConfig={{ status: true, bottom: '95px', right: positionIcon }}
        // dimensionToolConfig={{ status: true, bottom: '131px', right: positionIcon }}
        // themeToolConfig={{ status: true, bottom: '203px', right: positionIcon }}
        // checkboxToolConfig={{status: true, bottom: '167px', right: positionIcon}}
        // flyTo={currLive ? [currLive.lng, currLive.lat] : null}
        // radius={liveType > 0 && liveType != 3 ? radius : 0}
        // liveType={liveType}
        // updateCenter={updateCenter}
        // theme={theme}
        // onClickMarker={clickMarkerCallback}
        // seletedData={currLive}
      />
      {checkboxStatus && (
        <div className={styles.check_box}>
          <CheckBox
            defaultValue={checkboxDefaultValue}
            data={enclosureCheckList}
            setCheckBoxValue={changeCheck}
            isConfig={true}
            defaultCheckList={enclosureCheckList}
            configCheckList={configCheckList}
            allList={showOverview ? checkAllList : store?.newCheckAllList}
            theme={theme}
          />
        </div>
      )}
      <div className={styles.search}>
        <Select
          showSearch
          size='middle'
          suffixIcon={<CaretDownOutlined className={styles.icon} />}
          placeholder='热门词'
          optionFilterProp='children'
          onSearch={onSearch}
          onChange={changeSelect}
          dropdownClassName={styles.search_select}
          filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        >
          {keyWordList.map((item) => (
            <Option value={JSON.stringify(item)}>{item.liveName}</Option>
          ))}
        </Select>
        {/* <Button type='primary' className={styles.btn_search} onClick={() => setIsModalVisible1(true)}>
          劲松街道管控区保供
        </Button> */}
      </div>
      {!iframe && menuData.current.length > 0 && (
        <Dropdown overlayClassName={styles.menu_select} trigger={['click']} overlay={menu}>
          <Button className={styles.menu_btn} type='primary'>
            <Space>
              保供方案 <DownOutlined />
            </Space>
          </Button>
        </Dropdown>
      )}
      <div className={styles.content_wrap}>
        {showRightBtn ? (
          <div className={styles.com_padding}>
            <div className={styles.leftPannel}>
              <Total data={totalCount} />
              <div className={styles.enclosureChart}>
                <div className={styles.boxShadow}>
                  <Chart
                    data={{
                      ...weekCount,
                      title: '最近一周高风险区域数量变化',
                      unit: '（个）',
                    }}
                    styleType='enclosure'
                    theme={theme}
                  />
                </div>
              </div>
              <div className={`${styles.table_list}  ${styles.boxShadow}`}>
                <TableList
                  columns={weekCircleColumns}
                  dataSource={weekCircleAmount}
                  title='高风险区统计'
                  rowKey='area'
                  heightType='enclosure'
                  onClick={selectRowChange}
                  cilckTitle={cilckTitle}
                  // cilckTitle={!sessionArea && cilckTitle}
                />
              </div>
            </div>
          </div>
        ) : (
          ''
        )}
        <div className={styles.rightPannel}>
          {showRightBtn ? (
            <div className={`${styles.leftBtn} ${styles.btn}`} onClick={() => handleBtnClick('right', false)}></div>
          ) : (
            <div className={`${styles.rightBtn} ${styles.btn}`} onClick={() => handleBtnClick('right', true)}></div>
          )}
        </div>
      </div>
      <div className={`${styles.right_wrap}  ${iframe ? styles.mobileP : ''}`}>
        <div className={styles.leftPannel}>
          {showLeftButton ? (
            <div className={`${styles.rightBtn} ${styles.btn}`} onClick={() => handleBtnClick('left', false)}></div>
          ) : (
            <div className={`${styles.leftBtn} ${styles.btn}`} onClick={() => handleBtnClick('left', true)}></div>
          )}
        </div>
        {showLeftButton ? (
          <div className={styles.com_padding}>
            <div className={styles.rightPannel}>
              {showOverview ? (
                <>
                  {/* 总揽 */}
                  {/* <ImageTab option={imageTabOption} switchImage={(obj) => selectImage(obj)} /> */}
                  <OverView
                    data={overViewData}
                    title='总览'
                    ext=''
                    pointName={overDesc}
                    heightType={440}
                    moreBtn={true}
                    btnTitle={'更多 ···'}
                    handleClick={() => showIsMoreModalVisible()}
                  />
                  {sealingSealingType && sealingSealing()}
                </>
              ) : (
                <Tabs className={`${styles.right_top_tab}`} defaultActiveKey={controlType} onChange={setControlType}>
                  {/* 封管控点 */}
                  <TabPane
                    key={LOCK_DOWN}
                    tab={
                      <span className={styles.title_icon}>
                        {controlType === 'lockDown' ? (
                          <img src={require(`@/assets/images/${theme}/table_title_active_icon.png`)} alt='' />
                        ) : (
                          <img src={require(`@/assets/images/${theme}/table_title_icon.png`)} alt='' />
                        )}
                        {CONTROL_TYPES[LOCK_DOWN]}
                      </span>
                    }
                  >
                    <div className={styles.boxShadowInTab}>
                      <ReturnOverview onClickBack={() => setShowOverview(true)} />
                      {/* <Player url={markVideoUrl} /> */}
                      {/* {markVideoUrl && markVideoUrl !== 'null' && <Player url={markVideoUrl} />} */}
                      <div className={styles.seal_tube}>
                        <img src={require(`./assets/community.jpg`)} />
                      </div>
                    </div>
                    <OverView
                      data={lockDownSource}
                      title='基础信息'
                      ext=''
                      pointName={currLive?.liveName}
                      heightType={markVideoUrl && markVideoUrl !== 'null' ? 520 : 705}
                      moreBtn={true}
                      btnTitle={'保供方案一表'}
                      handleClick={() => showBaoGongModalVisible()}
                    />
                  </TabPane>
                  {/* 供保资源 */}
                  <TabPane
                    key={SUPPLY_GUARANTEE}
                    tab={
                      <span className={styles.title_icon}>
                        {controlType === 'supplyGuarantee' ? (
                          <img src={require(`@/assets/images/${theme}/table_title_active_icon.png`)} alt='' />
                        ) : (
                          <img src={require(`@/assets/images/${theme}/table_title_icon.png`)} alt='' />
                        )}
                        {CONTROL_TYPES[SUPPLY_GUARANTEE]}
                      </span>
                    }
                  >
                    <div className={styles.boxShadowInTab}>
                      <ReturnOverview onClickBack={() => setShowOverview(true)} />
                      <SupplySearch radiusConfig={radiusConfig} handleRefresh={handleRefresh} theme={theme} />
                    </div>
                    {/* 生活圈 配送圈 管控圈 */}
                    <div className={`${styles.right2_wrap} ${styles.boxShadowNoBg}`}>
                      {/* <div className={styles.leftPannel}>
                        {showDetail && showLeftButton ? (
                          <div className={`${styles.rightBtn} ${styles.btn}`} onClick={() => handleBtnClick('left', false)}></div>
                        ) : (
                          <div className={`${styles.leftBtn} ${styles.btn}`} onClick={() => handleBtnClick('left', true)}></div>
                        )}
                      </div> */}
                      <div className={styles.rightPannel}>
                        <Tab
                          handleClose={tabHandleClose}
                          showControl={showControl}
                          liveType={liveType}
                          handleSelect={tabHandleSelect}
                        />
                        <div className={styles.mgb12}>
                          <TableTab
                            columns={siteColumns}
                            dataSource={site}
                            heightType={212}
                            rowKey='id'
                            options={{ title: '场所', unit: site?.length }}
                          />
                        </div>
                        <div className={styles.mgb12}>
                          <TableTab
                            columns={staffColumns}
                            dataSource={staff}
                            heightType={212}
                            rowKey='id'
                            options={{ title: '人员', unit: staff?.length }}
                          />
                        </div>
                        <CarTableTab
                          columns={carColumns}
                          dataSource={cars}
                          rowKey='id'
                          options={{ title: '配送车次（近七日）', unit: cars?.length }}
                          handleClick={generateBaoGong}
                        />
                      </div>
                    </div>
                  </TabPane>
                </Tabs>
              )}
            </div>
          </div>
        ) : (
          ''
        )}
      </div>
      <Modal visible={isModalVisible} className={styles.enclosureDialog} width={420}>
        <TableDailog item={modalDetail} handleClose={() => setIsModalVisible(false)} />
      </Modal>

      <Modal
        // title={activeMenu.title}
        visible={isModalVisible1}
        zIndex={10001}
        centered
        width='80%'
        bodyStyle={{
          minHeight: '700px',
          overflow: 'hidden',
          padding: 0,
          margin:0
        }}
        footer={null}
        sticky
        // onCancel={() => {
        //   setIsModalVisible1(false);
        // }}
        destroyOnClose
        wrapClassName={styles.enclosureChartDialog}
        closable={false}
      >
        <div className='tabs_top'>
          <p className='title'>{activeMenu.title}</p>
          <img src={require('@/assets/images/solution_title_icon.png')} alt='' />
          <img
            onClick={() => setIsModalVisible1 && setIsModalVisible1(false)}
            src={require('@/assets/images/clos_icon_night.png')}
            alt=''
          />
        </div>
        <Tabs defaultActiveKey='1' onChange={changeTabs}>
          {!activeMenu.hasTu && (
            <Tabs.TabPane tab='一图' key='1'>
              {!!activeMenu.imgKey && (
                <img src={require(`@/assets/images/demo_tu${activeMenu.imgKey}.png`)} width='100%' height='100%' />
              )}
            </Tabs.TabPane>
          )}
          {!activeMenu.hasBiao && (
            <Tabs.TabPane tab='一表' key='2'>
              {!!activeMenu.imgKey && (
                <img src={require(`@/assets/images/demo_biao${activeMenu.imgKey}.png`)} width='100%' height='100%' />
              )}
            </Tabs.TabPane>
          )}
        </Tabs>
      </Modal>

      {/* // 更多 */}
      {/* <Modal visible={isMoreModalVisible} zIndex={10001} className={styles.enclosureDialog} width='80%' >
        <MoreTableDialog area={moreArea} handleClose={() => setIsMoreModalVisible(false)} />
      </Modal> */}
      {isMoreModalVisible && (
        <MoreTableDialog
          isModalVisible={isMoreModalVisible}
          type={2}
          desc={moreDiaLogDesc}
          requestParams={moreParams}
          onCancel={() => setIsMoreModalVisible(false)}
        />
      )}
      {/* 保供 */}
      {isBaoGongModalVisible && (
        <MoreTableDialog
          isModalVisible={isBaoGongModalVisible}
          type={1}
          title={currLive ? currLive.liveName : ''}
          requestParams={guaranteeParams}
          onCancel={() => setIsBaoGongModalVisible(false)}
        />
      )}
      {/* <BaoGongTabDialog
        isModalVisible={isBaoGongModalVisible}
        setIsModalVisible={setIsBaoGongModalVisible}
        title={currLive? currLive.liveName : ''}
        // setTitle={setTitle}
        requestParams={guaranteeParams}
        showParamaBtn={guaranteeBtn}
      /> */}
    </div>
  );
}

// export default Enclosure;
export default inject('enclosure')(observer(Enclosure));
