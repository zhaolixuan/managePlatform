/* eslint-disable no-unused-vars */
import getRequestInstance from '@/utils/getRequestInstance';
import { domains } from '@/config';

const managerCenterAdapter = getRequestInstance(domains.managerBaseUrl);

// 报备分页查询
export const getTable = async (param) => await managerCenterAdapter.post('/carDriver/page', param);

// 列表导出功能
export const downloadFile = async (param) => await managerCenterAdapter.raw.post('/carDriver/outExcel', param);

// 查看详情
export const checkDetail = async (param) => await managerCenterAdapter.get(`/carDriver/queryCarInfo?id=${param}`);
