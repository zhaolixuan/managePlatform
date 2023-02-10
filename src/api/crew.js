import getRequestInstance from '@/utils/getRequestInstance';
import { domains } from '@/config';

const siteCenterAdapter = getRequestInstance(domains.site);

// // 行政区、企业数量、从业人员数量聚合数据
// export const administrative = async (param) => await siteCenterAdapter.get('/personnel/administrative', param);

// 各区企业与人员数量统计
export const administrative = async (param) =>
  await siteCenterAdapter.post('/personnel/queryPersonnelAndCompanyCount', param);

// 北京进口非冷链货物从业人员
export const coldChain = async (param) => await siteCenterAdapter.raw.get('/personnel/coldChain', param);

// // 人员企业列表
// export const screen = async (params) => await siteCenterAdapter.raw.get('/personnel/screen', { params });

// 查询配送人员详情及经纬度列表
export const screen = async (params) => await siteCenterAdapter.post('/personnel/queryStaffList', params);

// 查询封控类型
export const querySealingSealingType = async (params) =>
  await siteCenterAdapter.post('/sealing/querySealingSealingType', params);

// 查询各个类型图片数据-type1.人员2.境内车辆3.境外车辆5.场所4.防疫
export const querySupportImgMappingList = async (params) =>
  await siteCenterAdapter.raw.get('/sealing/querySupportImgMappingList', { params });

// 查询各个所在区下数据-无参默认最新
export const querySealingList = async (params) => await siteCenterAdapter.post('/sealing/querySealingList', params);

// 根据类别查询
export const queryStaff = async (params) => await siteCenterAdapter.get('/personnel/query/staff', { params });

// 根据状态查询
export const queryState = async (params) => await siteCenterAdapter.get('/personnel/query/state', { params });

// 获取白名单token
export const getToken = async (params) => await siteCenterAdapter.get('/thirdpartygov/getToken', { params });

// 白名单数量
export const thirdpartygov = async (params) => await siteCenterAdapter.post('/thirdpartygov/statisticDistrict', { params });

export const queryCompanyStaffList = async (params) => await siteCenterAdapter.post('/personnel/queryCompanyStaffList', params)
