import { action, runInAction, extendObservable, } from 'mobx';
import { message } from '@jd/find-react';
import * as api from '@/api/packetControl';

// 可观察属性
const OBSERVABLE = {
  areaList: [],
  sealingList: [],
  sealingTypeList: [],
  poiSearchData: [],
  loading: false,
  pagination: {
    pageSize: 10,
    page: 1,
    total: 0,
  },
};

class Store {
  constructor() {
    extendObservable(this, {
      ...OBSERVABLE,
    });
  }

  // 获取行政区列表
  @action.bound async getAreaList(params) {
    try {
      const res = await api.getAreaList(params);
      runInAction(() => {
        this.areaList = res || [];
      })
    } catch (error) {
      message.error(error.message);
    }

  }

  // 查询各个区封控数据
  @action.bound async querySealingList(params) {
    try {
      runInAction(() => {
        this.loading = true;
      })
      const res = await api.querySealingList(params);
      const reaData = res.map(item => ({
        ...item,
        key: item.id
      })).sort((a, b) => a.status - b.status);
      runInAction(() => {
        this.sealingList = reaData || [];
        this.loading = false;
      })
    } catch (error) {
      message.error(error.message);
    }

  }

  // 获取封控类型列表
  @action.bound async sealingType(params) {
    try {
      const res = await api.sealingType(params);
      runInAction(() => {
        this.sealingTypeList = res || [];
        this.pagination.total = res.total
      })
    } catch (error) {
      message.error(error.message);
    }

  }

  // 搜多获取poi点的坐标数据
  @action.bound async poiSearch(params) {
    return await api.poiSearch(params);
  }

  // 保存绘制风控区的数据
  @action.bound async saveDrawData(params) {
    return await api.saveDrawData(params);
  }

  // 验证导入的封控excel数据
  @action.bound async validExcel(params) {
    return await api.validExcel(params);
  }

  // 导入封控excel数据
  @action.bound async exportExcel(params) {
    return await api.exportExcel(params);
  }

  // 保存封控人口属性
  @action.bound async savePeople(params) {
    return await api.savePeople(params);
  }

  // 批量数据入库
  @action.bound async saveStore(params) {
    return await api.saveStore(params);
  }

  @action.bound reset() {
    Object.assign(this, OBSERVABLE);
  }

  @action.bound update(data) {
    Object.assign(this, data);
  }
}

export default new Store();
