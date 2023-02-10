import getRequestInstance from '@/utils/getRequestInstance';
import { domains } from '@/config';

const managerCenterAdapter = getRequestInstance(domains.managerBaseUrl);

// 获取进销存列表
export const getSupplyChainList = async (param) => await managerCenterAdapter.post('/replenishment/supplyChain/queryAll', param);

// 获取进销存列表----新增
export const addSupplyChain = async (param) => await managerCenterAdapter.post('/replenishment/supplyChain/insert', param);

// 获取进销存列表----删除
export const deleteItem = async (param) => await managerCenterAdapter.delete(`/replenishment/supplyChain/delete/${param}`);

// 获取进销存列表----修改
export const updataItem = async (param) => await managerCenterAdapter.put('/replenishment/supplyChain/update', param);

// 批量删除
export const batchDelete = async (params) => await managerCenterAdapter.post('/replenishment/supplyChain/batchDelete', params);