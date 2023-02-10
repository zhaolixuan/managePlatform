import { action, runInAction, extendObservable, } from 'mobx';
import { message } from '@jd/find-react';
import * as api from '@/api/manageSite';
import { getSiteLonLat } from '@/api/site'

// 可观察属性
const OBSERVABLE = {
  areaList: [],
  sealingTypeList: [],
  tableData: [],
  pagination: {
    pageSize: 10,
    current: 1,
    total: 0,
  },
  loading: false,
  requestParama: {},
  gisData: [],
  streetList: []

};

class Store {
  constructor() {
    extendObservable(this, {
      ...OBSERVABLE,
    });
  }

  // 获取行政区/场所类型下拉选/街道列表
  @action.bound async queryDictionaryList(params) {
    try {
      const res = await api.queryDictionaryList(params);
      runInAction(() => {
        if (params.parentCode === 'DICT_XZQY') {
          this.areaList = res || [];
        } else if (params.parentCode === 'DICT_QYJD'){
          this.streetList = res || [];
        } else {
          this.sealingTypeList = res || [];
        }
      })
    } catch (error) {
      message.error(error.message);
    }
  }

  // 列表数据
  @action.bound async regionsPageList(params = {
    ...this.pagination,
    page: this.pagination.current,
    ...this.requestParama
  }) {
    try {
      runInAction(() => {
        this.loading = true;
      })
      const res = await api.regionsPageList(params);
      runInAction(() => {
        this.tableData = res?.list || [];
        this.pagination = {
          pageSize: res.pageSize,
          current: res.page,
          total: res.total
        }
        this.loading = false;
      })
    } catch (error) {
      message.error(error.message);
    }
  }

  // 处理后端返回的点位数据
  @action.bound filterGisData(data = []) {
    const resData = data?.map((item) => {
      return {
        markerId: item?.id,
        lng: item?.longitude,
        lat: item?.latitude,
        type: item?.businessType,
        markerType: item?.businessType,
        num: '',
        popupType: 1,
        ...item,
        url: '',
      };
    });
    return resData;
  }

  // 地图点位数据
  @action.bound async getSiteLonLat(params = {
    businessTypes: [1,2,3,4,5,6,7,8],
    businessName: '',
    area: '',
  }) {
    try {
      const res = await getSiteLonLat(params);
      runInAction(() => {
        this.gisData = this.filterGisData(res)
      });
    } catch (error) {
      message.error(error.message);
    }
  }

  // 新增
  @action.bound async addRegions(params) {
    return await api.addRegions(params);
  }

  // 删除
  @action.bound async deleteItem(params) {
    return await api.deleteItem(params);
  }


  // 验证导入的场所excel数据
  @action.bound async validExcel(params) {
    return await api.valid(params);
  }

  // 导入场所excel数据
  @action.bound async exportExcel(params) {
    return await api.save(params);
  }

  @action.bound reset() {
    Object.assign(this, OBSERVABLE);
  }

  @action.bound update(data) {
    Object.assign(this, data);
  }
}

export default new Store();
