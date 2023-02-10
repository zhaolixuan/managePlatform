import { action, runInAction, extendObservable, } from 'mobx';
import { message } from '@jd/find-react';
import * as api from '@/api/shortageOfFill';

// 可观察属性
const OBSERVABLE = {
  loading: false,
  supplyChainList: [],
  pagination: {
    pageSize: 10,
    page: 1,
    total: 0,
    showQuickJumper: true,
    showSizeChanger: true
  },
};

class Store {
  constructor() {
    extendObservable(this, {
      ...OBSERVABLE,
    });
  }

  // 获取进销存列表
  @action.bound async getSupplyChainList(params) {
    try {
      const res = await api.getSupplyChainList(params);
      runInAction(() => {
        this.supplyChainList = res.list || [];
        this.supplyChainList = this.supplyChainList.map(item => {
          return {
            ...item,
            enteringTime: item.enteringTime.split(' ')[0],
            businessName: params.businessName
          }
        })
        this.pagination.total = res.total
        console.log(this.supplyChainList)
      })
    } catch (error) {
      message.error(error.message);
    }
  }

  @action.bound async addSupplyChain(params) {
    // return await api.addSupplyChain(params);
    try {
      const res = await api.addSupplyChain(params);
      runInAction(() => {
        console.log(res)
        if(res.code === -4) {
          message.error(res.message);
        } else {
          message.success('新增成功');
        }
      })
    } catch (error) {
      message.error(error.data);
    }
  }

  @action.bound async deleteItem(params) {
    return await api.deleteItem(params);
  }

  @action.bound async update(params) {
    return await api.updataItem(params);
  }

  @action.bound updatePage(data) {
    Object.assign(this, data);
  }
}

export default new Store();
