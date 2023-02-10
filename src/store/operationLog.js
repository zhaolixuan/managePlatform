import { action, runInAction, extendObservable, } from 'mobx';
import { message } from '@jd/find-react';
import * as api from '@/api/operationLog';

// 可观察属性
const OBSERVABLE = {
  tableData: [],
  pagination: {
    pageSize: 10,
    current: 1,
    total: 0,
  },
  loading: false,
  requestParama: {},
  details: {}
};

class Store {
  constructor() {
    extendObservable(this, {
      ...OBSERVABLE,
    });
  }

  // 列表数据
  @action.bound async getList(params = {
    ...this.pagination,
    page: this.pagination.current,
    ...this.requestParama
  }) {
    try {
      runInAction(() => {
        this.loading = true;
      })
      const res = await api.getList(params);
      runInAction(() => {
        this.tableData = res?.records || [];
        this.pagination = {
          pageSize: res?.size || 10,
          current: res?.current || 1,
          total: res?.total || 0
        }
        this.loading = false;
      })
    } catch (error) {
      message.error(error.message);
    }
  }

  @action.bound async getDetail(params) {
    const res = await api.getDetail(params);
    runInAction(() => {
      this.details = res;
    })
  }

  @action.bound reset() {
    Object.assign(this, OBSERVABLE);
  }

  @action.bound update(data) {
    Object.assign(this, data);
  }
}

export default new Store();
