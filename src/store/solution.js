import { action, runInAction, extendObservable } from 'mobx';
import { message } from '@jd/find-react';
import * as api from '@/api/solution';

// 可观察属性
const OBSERVABLE = {
  tableData: [],
  oneTableData: [],
  paramsVisible: false,
  onePictureData: {},
  loading: false
};

class Store {
  constructor() {
    extendObservable(this, {
      ...OBSERVABLE,
    });
  }

  // 保供列表
  @action.bound async queryChart(params) {

    runInAction(() => {
      this.loading = true;
    })
    try {
      const res = await api.queryChart(params);
      res?.statisticals?.push({ ...res.statistical, disabled: true });
      runInAction(() => {
        this.tableData = res || [];
        this.loading = false;
      });
    } catch (error) {
      message.error(error.message);
    }
  }

  // 保供列表
  @action.bound async queryBigChart(params) {
    runInAction(() => {
      this.loading = true;
    })
    try {
      const res = await api.queryBigChart(params);
      res?.overviewListVOList?.push({ ...res.overviewListVO, disabled: true });
      runInAction(() => {
        this.tableData = res || [];
        this.loading = false;
      });
    } catch (error) {
      message.error(error.message);
    }
  }

  // 一表
  @action.bound async iconFormList(params) {
    runInAction(() => {
      this.loading = true;
    })
    try {
      const res = await api.iconFormList(params);
      runInAction(() => {
        this.oneTableData  = res.map(item => {
          const obj = {};
          item?.iconFormStockMap.forEach((i => {
            const key = Object.keys(i);
            obj[key] = {...i[key]}
          }))
          return ({
            ...item,
            ...obj
          })
        }) || [];
        this.loading = false;
      });
    } catch (error) {
      message.error(error.message);
    }
  }

  // 一图
  @action.bound async iconPicture(params) {
    try {
      const res = await api.iconPicture(params);
      runInAction(() => {
        this.onePictureData = res || {};
      });
    } catch (error) {
      message.error(error.message);
    }
  }

  // 下载word
  @action.bound async downloadWord(params) {
    return await api.downloadWord(params);
  }

  // 下载Execl
  @action.bound async downloadExecl(params) {
    return await api.downloadExecl(params);
  }

  @action.bound reset() {
    Object.assign(this, OBSERVABLE);
  }

  @action.bound update(data) {
    Object.assign(this, data);
  }
}

export default new Store();
