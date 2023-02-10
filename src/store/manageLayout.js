import { action, extendObservable } from 'mobx';
import { getBreadMap } from '@/router/menu';

// 可观察属性
const OBSERVABLE = {
  // 首页导航
  menuData: [],
  // 侧边栏导航
  sideMenuData: [],
  breadMap: {},
  breadList: [],
  oldBreadList: [],
};

class Layout {
  constructor() {
    extendObservable(this, {
      ...OBSERVABLE,
    });
  }

  @action.bound setBreadList(list) {
    this.oldBreadList = this.breadList;
    this.breadList = list;
  }

  @action.bound setBreadMap(routes) {
    this.breadMap = getBreadMap(routes);
  }

  @action.bound setSideMenuData(data) {
    this.sideMenuData = data;
  }

  @action.bound reset() {
    Object.assign(this, OBSERVABLE);
  }

  @action.bound update(data) {
    Object.assign(this, data);
  }

  @action.bound resetBreadList() {
    this.breadList = this.oldBreadList;
  }
}

export default new Layout();
