/* eslint-disable no-unused-vars */
import { action, runInAction, extendObservable } from 'mobx';
import { message } from '@jd/find-react';
import moment from 'moment';
import { getSiteLonLat } from '@/api/carIn';
import {
  getTopSixSupplyData,
  getPointPositionData,
  getSupplyFromPositionData,
  getCarFromOutProvinceData,
} from '@/api/carOut';

// 可观察属性
const OBSERVABLE = {
  carOutcurrentTime: moment().subtract(1, 'days').format('YYYY-MM-DD'), // 当前的日期
  fixedPointData: [],
  fromPointData: [],
  carOutMarkerData: {
    markerData: [],
    zoneData: [],
  },
  carOutImageOption: {
    tabTitle: '运货量TOP6',
    hasHead: true,
    imageList: [],
  },
  isShowCarFrom: false,
  carFromProvince: '',
  carListFromProvince: [],
};

class Store {
  constructor() {
    extendObservable(this, {
      ...OBSERVABLE,
    });
  }

  @action.bound async getCarOutTopSixImageOption(type = '3') {
    const res = await getTopSixSupplyData({ type });
    const pointRes = await getSiteLonLat({
      businessTypes: [1, 2, 3, 4, 5, 6, 7],
    });
    const imageList = Array.from(res.slice(0, 6), (item) => {
      const point = pointRes.find((val) => val.businessName === item.name) || {};
      const obj = Object.assign(item, point, {
        id: item.id,
        title: item.name,
      });
      return obj;
    });
    runInAction(() => {
      this.carOutImageOption = {
        tabTitle: '运货量TOP6',
        hasHead: true,
        imageList,
      };
    });
  }

  @action.bound async getRoadPointPosition(pointTypes = ['高速收费站', '冷链卡口']) {
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
      const data = [...highSpeeds, ...regionColds].filter((item) => pointTypes.includes(item.type));

      runInAction(() => {
        this.fixedPointData = data;
        const pointData = [...data, ...this.fromPointData];
        this.carOutMarkerData = {
          markerData: pointData,
          zoneData: [],
        };
      });
    } catch (error) {
      message.error(error.message);
    }
  }

  @action.bound async getSupplyFromPosition(params) {
    try {
      const res = await getSupplyFromPositionData({
        currentTime: moment().format('YYYY-MM-DD'),
        ...params,
      });
      const data = Array.from(res, (item) => ({
        ...item,
        markerId: item.id,
        type: '出发地',
        popupType: '',
        lng: item.receiveLongitude,
        lat: item.receiveLatitude,
        num: '',
        showPopup: 'false',
      }));

      runInAction(() => {
        this.fromPointData = data;
        const pointData = [...data, ...this.fixedPointData];
        this.carOutMarkerData = {
          markerData: pointData,
          zoneData: [],
        };
      });
    } catch (error) {
      message.error(error.message);
    }
  }

  @action.bound async setCarFromProvince(params) {
    const res = await getCarFromOutProvinceData({
      goodsSourceAreaOut: this.carFromProvince,
      startAddress: '',
      ...params,
    });
    runInAction(() => {
      this.carListFromProvince = res || [];
    });
  }

  @action.bound async setIsShowCarFrom(province) {
    runInAction(() => {
      this.carFromProvince = province;
      if (province) {
        this.setCarFromProvince();
        this.isShowCarFrom = true;
      } else {
        this.isShowCarFrom = false;
        this.carListFromProvince = [];
      }
    });
  }

  @action.bound async setCarFrom(province) {
    runInAction(() => {
      this.carFromProvince = province;
    });
  }
}

export default new Store();
