import getRequestInstance from '@/utils/getRequestInstance';
import { domains } from '@/config';

const managerCenterAdapter = getRequestInstance(domains.managerBaseUrl);

// 列表
export const getList = async (params) => await managerCenterAdapter.post('/sysLog/listPage', params);
// 详情
export const getDetail = async (params) => await managerCenterAdapter.get('/sysLog/getDetail', { params });
