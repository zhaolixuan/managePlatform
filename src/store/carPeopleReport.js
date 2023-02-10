import { action, extendObservable,runInAction } from 'mobx';
import { message } from '@jd/find-react';
import * as api from '@/api/carPeopleReport';

const OBSERVABLE = {
  tableData: [],
  detailData: [],
  pagination: {
    pageSize: 10,
    current: 1,
    total: 0,
  },
  requestParama: {},
  loading: false,
};

class ReportStore {
  constructor() {
    extendObservable(this, {
      ...OBSERVABLE,
    });
  }

  // 获取表格的数据
  @action.bound async getTable(params = {
    ...this.pagination,
    page: this.pagination.current,
    ...this.requestParama
  }) {
    try {
      runInAction(() => {
        this.loading = true;
      })
      const res = await api.getTable(params);
      console.log(res,'----???')
      runInAction(() => {
        this.loading = false;
        this.tableData = res;
        this.pagination = {
          pageSize: res.pageSize || 10,
          current: res.page,
          total: res.total
        }
        this.requestParama = params;
      });
    } catch (error) {
      message.error(error.message);
    }
  }

  // 导出列表
  @action.bound async downloadFile(params) {
    return await api.downloadFile(params);
  }

  // 获取详情的数据
  @action.bound async checkDetail(params) {
    try {
      const data = await api.checkDetail(params);
      runInAction(() => {
        this.detailData = {
          ...data,
          provenance: `${data.provinceName}${data.cityName}${data.areaName}`
        };
        return data;
      });
    } catch (error) {
      message.error(error.message);
    }
  }

  // 更新数据
  @action.bound update(data) {
    Object.assign(this, data);
  }
}

export default new ReportStore();