import getRequestInstance from '@/utils/getRequestInstance';
import { domains } from '@/config';

const managerCenterAdapter = getRequestInstance(domains.managerBaseUrl);

// 列表
export const getList = async (params) => await managerCenterAdapter.post('/setting/page', params);
// 更新状态
export const setController = async (params) => await managerCenterAdapter.put('/setting/controller', params);
