import getRequestInstance from '@/utils/getRequestInstance';
import { domains } from '@/config';

const managerCenterAdapter = getRequestInstance(domains.managerBaseUrl);

// 获取行政区列表
export const getAreaList = async (param) => await managerCenterAdapter.get('/sealing/area', param);

// 保存封控excel数据
export const exportExcel = async (params) =>
  await managerCenterAdapter.post('/sealing/excel/save', params);

// 验证导入的封控excel数据
export const validExcel = async (params) => await managerCenterAdapter.post('/sealing/excel/valid', params);

// 查询各个区封控数据
export const querySealingList = async (params) => await managerCenterAdapter.post('/sealing/querySealingList', params);

// 保存封控坐标属性
export const savePosition = async (params) => await managerCenterAdapter.get('/sealing/save/position', { params });

// 保存封控人口属性
export const savePeople = async (params) => await managerCenterAdapter.post('/sealing/save/people', params);

// 批量数据入库
export const saveStore = async (params) => await managerCenterAdapter.post('/sealing/save/store', params);

// 获取封控类型列表
export const sealingType = async (params) => await managerCenterAdapter.get('/sealing/sealing_type', params);

// 保存地图画封控区数据
export const saveDrawData = async (params) => await managerCenterAdapter.post('/sealing/save/position', params);

// 搜索获取poi数据
// export const poiSearch = async (params) => await managerCenterAdapter.get(`${window.GLOBAL_CONFIG.baseMapApi}/jinxin/icity-support-screen/AddrCode/cmd?address=${params}&output=JSON&batch=true&coord=cgcs2000&adcode=yes`, params);
export const poiSearch = async (params) => await managerCenterAdapter.post('jxjProxy/api', params);

// export const poiSearch = async (params) => await managerCenterAdapter.get(`/jinxin/icity-support-screen/NavigationService?request=poi&type=BESN&keyword=${params}&number=20&batch=1&memo=&highlight=false&keytype=&field=encode=gbk`, params);

// 批量删除
export const batchDeleteSealingControl = async (params) => await managerCenterAdapter.post('/sealing/batchDeleteSealingControl', params);
