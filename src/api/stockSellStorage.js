import getRequestInstance from '@/utils/getRequestInstance';
import { domains } from '@/config';

const managerCenterAdapter = getRequestInstance(domains.managerBaseUrl);

// 获取进销存列表
export const getSupplyChainList = async (param) => await managerCenterAdapter.post('/supplyChain/querySupplyChain', param);

// 获取进销存列表----新增
export const addSupplyChain = async (param) => await managerCenterAdapter.post('/supplyChain/insertSupplyChain', param);

// 获取进销存列表----删除
export const deleteItem = async (param) => await managerCenterAdapter.delete(`/supplyChain/deleteSupplyChain/${param}`);

// 获取进销存列表----修改
export const updataItem = async (param) => await managerCenterAdapter.put('/supplyChain/updateSupplyChain', param);

// 查询进销存维护的商品明细模板
export const queryGoodsModel = async () => await managerCenterAdapter.get('/supplyChain/queryGoodsModel');

// 进销存明细数据批量保存
export const batchSaveSupplyChainDetail = async (param) => await managerCenterAdapter.post('/supplyChain/batchSaveSupplyChainDetail', param);

// 查询进销存明细数据
export const querySupplyChainGoodsDetail = async (param) => await managerCenterAdapter.post('/supplyChain/querySupplyChainGoodsDetail', param);

// 批量删除
export const batchDeleteSupplyChain = async (params) => await managerCenterAdapter.post('/supplyChain/batchDeleteSupplyChain', params);
