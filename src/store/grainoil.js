import { action, runInAction, extendObservable, } from 'mobx';
import { message } from '@jd/find-react';
import * as api from '@/api/grainoil';

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
      const res = await api.queryList(params);
      runInAction(() => {
        this.tableData = res || [];
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
