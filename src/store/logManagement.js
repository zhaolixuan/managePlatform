import { action, extendObservable,runInAction } from 'mobx';
import { message } from '@jd/find-react';
import moment from 'moment';
import * as api from '@/api/logManagement';

const OBSERVABLE = {
  tableData: [],
  detailData: [],
  pagination: {
    pageSize: 5,
    current: 1,
    total: 0,
  },
  requestParama: {},
  loading: false,
  trafficAndRatesData:{},
  trafficData: {},
  orgAccessData: [],
  functionAccessData:[]
};

class ReportStore {
  constructor() {
    extendObservable(this, {
      ...OBSERVABLE,
    });
  }
  
  // 获取访问量和访问率
  @action.bound async getTrafficAndRatesData(params) {
    try {
      const data = await api.getTrafficAndRates(params);
      console.log(data,'----访问量和访问率')
      runInAction(() => {
        this.trafficAndRatesData = data;
        return data;
      });
    } catch (error) {
      message.error(error.message);
    }
  }

  // 访问量折线图数据
  @action.bound async getTrafficData(params) {
    try {
      await api.getTraffic(params).then((res) => {
        const xData = res?.map((item) => moment(item.date).format('MM.DD'));
        const yData = res?.map((item) => item.count);
        runInAction(() => {
          this.trafficData = {
            xData,
            yData,
          };
        });
      });
    } catch (error) {
      message.error(error.message);
    }
  }

  // 获取区域热度数据
  @action.bound async getOrgAccessData(params) {
    try {
      const data = await api.getOrgAccessData(params);
      console.log(data,'----区域热度数据')
      runInAction(() => {
        this.orgAccessData = data;
        return data;
      });
    } catch (error) {
      message.error(error.message);
    }
  }

  // 获取功能热度数据
  @action.bound async getFunctionAccessData(params) {
    try {
      const data = await api.getFunctionAccessData(params);
      console.log(data,'----功能热度数据')
      runInAction(() => {
        this.functionAccessData = data;
        return data;
      });
    } catch (error) {
      message.error(error.message);
    }
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
      });
    } catch (error) {
      message.error(error.message);
    }
  }

  // 添加用户的操作记录
  @action.bound async addLogRecord(params) {
    try {
      const data = await api.addLogRecord(params);
      console.log(data,'----添加用户的操作记录')
      runInAction(() => {
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
