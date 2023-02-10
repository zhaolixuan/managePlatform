import getRequestInstance from '@/utils/getRequestInstance';
import { domains } from '@/config';

const managerCenterAdapter = getRequestInstance(domains.managerBaseUrl);
const siteCenterAdapter = getRequestInstance(domains.site);
// 获取1层字典管理列表
export const listPage = async (param) => await managerCenterAdapter.post('/config/listPage', param);

// 新增
export const saveOrUpdate = async (param) => await managerCenterAdapter.post('/config/saveOrUpdate', param);

// 删除
export const deleteItem = async (param) => await managerCenterAdapter.post(`/config/delete`, param);


// 查询字典表数据
export const queryDictionaryList = async (param) => await siteCenterAdapter.post('/dictionary/queryDictionaryList', param);