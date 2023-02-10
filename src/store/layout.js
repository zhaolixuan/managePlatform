import { action, extendObservable } from 'mobx';
import { getBreadMap } from '@/router/menu';

// 可观察属性
const OBSERVABLE = {
  // 首页导航
  menuAllData: [
    {
      title: '保供场所',
      code: 'site',
      CODE: 'DICT_BGCSANDJCS'
    },
    {
      title: '封控区保供',
      code: 'enclosure',
      CODE: 'DICT_FGKQBGANDJCS'
    },
    // {
    //   title: '保供方案',
    //   code: 'solution',
    // },
    {
      title: '保供人员',
      code: 'user',
      CODE: 'DICT_BGRYANDJCS'
    },
    {
      title: '保供车辆（京外）',
      code: 'carOut',
      CODE: 'DICT_BGCLJWANDJCS'
    },
    {
      title: '保供车辆（京内）',
      code: 'carIn',
      CODE: 'DICT_BGCLJNANDJCS'
    },
    {
      title: '管理后台',
      code: 'manage',
      CODE: 'DICT_GLHTANDJCS'
    },
    {
      title: '联系我们',
      code: 'contact',
      CODE: 'DICT_LXWMANDJCS'
    },
  ],
  menuData: [],
  // 侧边栏导航
  sideMenuData: [],
  breadMap: {},
  breadList: [],
  oldBreadList: [],
};

class LayoutStore {
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

export default new LayoutStore();
