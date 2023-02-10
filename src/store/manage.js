import { action, extendObservable } from 'mobx';
import * as api from '@/api/datashare';

const OBSERVABLE = {};

class ManageStore {
  constructor() {
    extendObservable(this, {
      ...OBSERVABLE,
    });
  }

  @action.bound async getInterfaceList(params) {
    return await api.getInterfaceListReq(params);
  }

  @action.bound reset() {
    Object.assign(this, OBSERVABLE);
  }

  @action.bound update(data) {
    Object.assign(this, data);
  }
}

export default new ManageStore();
