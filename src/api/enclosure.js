import getRequestInstance from '@/utils/getRequestInstance';
import { domains } from '@/config';

const enclosureAdapter = getRequestInstance(domains.site);

export const getAmountCircleData = async (params) => await enclosureAdapter.get(`/sealing/querySealingPercentum?area=${params.area}`);

export const getWeekCountData = async (params) => await enclosureAdapter.get(`/sealing/querySealingDateCount?area=${params.area}`);

export const getWeekCircleAmountData = async () => await enclosureAdapter.get('/sealing/querySealingPercentumByArea');

// 管控小区查询
export const querySealingList = async (params) => await enclosureAdapter.post('/sealing/querySealingList', params);

// 封控类型
export const querySealingSealingType = async (params) =>
  await enclosureAdapter.post('/sealing/querySealingSealingType', params);

export const poiDetails = async (params) => await enclosureAdapter.post('/site/poiDetails', params);

export const siteDetails = async (params) => await enclosureAdapter.post('/site/siteDetails', params);

// 所有车辆改为蔬菜直通车车辆
export const carDetails = async (params) => await enclosureAdapter.post('/car/directCarDetails', params); // /site/carDetails

export const querySupportImgMappingList = async (params) =>
  await enclosureAdapter.get('/sealing/querySupportImgMappingList?type=4', params);

export const staffDetails = async (params) => await enclosureAdapter.post('/site/personnelDetails', params);
export const queryStaffList = async (params) => await enclosureAdapter.post('/personnel/queryStaffList', params);
export const queryControl = async (params) => await enclosureAdapter.get(`/site/queryControl?id=${params.id}`, params);

// 区级保供场所
export const queryRegionGuaranteed = async (params) => await enclosureAdapter.get(`/site/queryRegionGuaranteed?area=${params.area?params.area:''}&radius=${params.radius?params.radius:''}&latitude=${params.latitude?params.latitude:''}&longitude=${params.longitude?params.longitude:''}&businessName=${params.businessName?params.businessName:''}`, params);

// 获取userid以及token
export const queryOpenUserId = async (params) => await enclosureAdapter.post('/jzb/openUserId', params);
// 保供列表
export const queryChart = async (param) => await enclosureAdapter.get('/site/queryChart', param);
// 总览详情
export const overInfo = async (param) => await enclosureAdapter.post('/sealing/queryOverview', param);
