/* eslint-disable no-unused-vars */
import getRequestInstance from '@/utils/getRequestInstance';
import { domains } from '@/config';

const managerCenterAdapter = getRequestInstance(domains.managerBaseUrl);

// 获取访问量和访问率
export const getTrafficAndRates = async (param) => await managerCenterAdapter.post('/operation/log/getTrafficAndRates', param);

// 访问量折线图数据
export const getTraffic = async (param) => await managerCenterAdapter.post('/operation/log/getTrafficData', param);

// 获取列表
export const getTable = async (param) => await managerCenterAdapter.post('/operation/log/getOperationLogDetail', param);

// 获取区域热度数据
export const getOrgAccessData = async (param) => await managerCenterAdapter.post('/operation/log/getOrgAccessData', param);

// 获取功能热度数据
export const getFunctionAccessData = async (param) => await managerCenterAdapter.post(`/operation/log/getFunctionAccessData`, param);


const managerCenterAdapter1 = getRequestInstance(domains.site);
// 添加用户的操作记录
export const addLogRecord = async (param) => await managerCenterAdapter1.post(`/operation/log/record`, param);
