import { action, runInAction, extendObservable, } from 'mobx';
import { message } from '@jd/find-react';
import * as api from '@/api/system';

// 可观察属性
const OBSERVABLE = {
  tableData: [],
  pagination: {
    pageSize: 10,
    page: 1,
    total: 0,
  },
  loading: false,
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
  }) {
    try {
      runInAction(() => {
        this.loading = true;
      })
      const res = await api.getList(params);
      runInAction(() => {
        this.tableData = res?.list || [];
        this.pagination = {
          pageSize: res?.pageSize || 10,
          page: res?.page || 1,
          total: res?.total || 0
        }
        this.loading = false;
      })
    } catch (error) {
      message.error(error.message);
    }
  }

  @action.bound async setController(params) {
    return await api.setController(params)
  }

  @action.bound reset() {
    Object.assign(this, OBSERVABLE);
  }

  @action.bound update(data) {
    Object.assign(this, data);
  }
}

export default new Store();
