import { action, extendObservable, runInAction } from 'mobx';

import * as api from '@/api/gis';

const OBSERVABLE = {
  demoList: [], // 测试数据
  // theme:'dark', // 主题色
  theme:'white', // 主题色(todo:暂时改为white)
  selectedType: '全部', // 所选择场所类型
  checkboxValue: [], // 所选中的多选框内的值
  popupData: {}, // 弹出框内的内容
  activeMarkerInfo: '', // 激活的marker
  markerStatus: 'notActive', // marker是否被激活的状态，以此来判断时候请求popup数据
  searchResult: {}, // 搜索得到的marker数据
  curRegion: sessionStorage.getItem('area') || '北京', // 当前选中的行政区域
  isClickedPicture: false, // 是否是点击图片
  showTracksTable: false, // 是否展示货车清单
  curStreet: '', // 当前的街道
  checkboxStatus: false, // checkbox的状态
  enclosureCheckList: [
    // {
    //   label: '批发市场',
    //   icon: 'wholeSaleMarket',
    //   value: '批发市场',
    // },
    // {
    //   label: '电商大仓',
    //   icon: 'eleSuppliesWarehouse',
    //   value: '电商大仓',
    // },
    // {
    //   label: '连锁企业',
    //   icon: 'superMarket',
    //   value: '连锁超市',
    // },
    // {
    //   label: '前置仓',
    //   icon: 'leadWarehouse',
    //   value: '前置仓',
    // },
    // {
    //   label: '社区菜市场',
    //   icon: 'foodMarket',
    //   value: '社区菜市场',
    // },
    // {
    //   label: '直营直供',
    //   icon: 'directSale',
    //   value: '直营直供',
    // },
    // {
    //   label: '超市门店',
    //   icon: 'marketStore',
    //   value: '超市门店',
    // },
    // {
    //   label: '直通车企业',
    //   icon: 'vegetableCar',
    //   value: '蔬菜直通车',
    // },
    // {
    //   label: '冷链卡口(26)',
    //   icon: 'codeChain',
    //   value: '冷链卡口',
    // },
    // {
    //   label: '高速收费站(130)',
    //   icon: 'hignwayStation',
    //   value: '高速收费站',
    // },
    {
      label: '封控区',
      icon: 'bannedArea',
      value: '封控区',
    },
    {
      label: '管控区',
      icon: 'manageArea',
      value: '管控区',
    },
    // {
    //   label: '配送人员',
    //   icon: 'staff',
    //   value: '配送人员',
    // },
    // {
    //   label: '关停门店',
    //   icon: 'closeShop',
    //   value: '关停门店',
    // },
    // {
    //   label: '蔬菜直通车',
    //   icon: 'vehicle',
    //   value: '车辆',
    // },
    // {
    //   label: '区级保供场所',
    //   icon: 'zoneSupplySite',
    //   value: '区级保供场所',
    // },
  ]
};
const html = document.querySelector('html');
html.setAttribute('theme','white');

class GisStore {
  constructor() {
    extendObservable(this, {
      ...OBSERVABLE,
    });
  }

  @action.bound async getInterfaceList(params) {
    const data = await api.getInterfaceListReq(params);
    runInAction(() => {
      this.demoList = data.items || [];
    });
    return data;
  }

  @action.bound reset() {
    Object.assign(this, OBSERVABLE);
  }

  @action.bound update(data) {
    Object.assign(this, data);
  }

  @action.bound setSelectedType(type) {
    this.selectedType = type;
  }
  
  @action.bound setTheme(type) {
    let typeCopy = type // 临时兼容“back”的情况
    if(type === 'back'){
      typeCopy = 'dark';
    }
    this.theme = typeCopy;
    html.setAttribute('theme', typeCopy);
  }

  @action.bound setCheckBoxValue(array) {
    this.checkboxValue = array;
  }

  @action.bound setPopupData(data) {
    this.popupData = data;
  }

  @action.bound setActiveMarkerInfo(data) {
    this.activeMarkerInfo = data;
  }

  @action.bound setSearchResult(data) {
    this.searchResult = data;
  }

  @action.bound setCurRegion(region) {
    this.curRegion = region;
  }

  @action.bound setMarkerStatus(status) {
    runInAction(() => {
      this.markerStatus = status;
    });
  }

  @action.bound setIsClickedPicture(status) {
    runInAction(() => {
      this.isClickedPicture = status;
    });
  }

  @action.bound setShowTracksTable(status) {
    this.showTracksTable = status;
  }

  @action.bound setEnclosureCheckList(checkList) {
    runInAction(() => {
      this.enclosureCheckList = checkList;
    });
  }

  @action.bound setCheckboxStatus(status) {
    runInAction(() => {
      this.checkboxStatus = status;
    });
  }

  @action.bound setCurStreet(street) {
    runInAction(() => {
      this.curStreet = street;
    });
  }
}

export default new GisStore();
