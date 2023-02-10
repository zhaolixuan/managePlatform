/* eslint-disable no-unused-vars */
import getRequestInstance from '@/utils/getRequestInstance';
import { domains } from '@/config';

const managerCenterAdapter = getRequestInstance(domains.managerBaseUrl);
const siteCenterAdapter = getRequestInstance(domains.site);

// 查询字典表数据
export const queryDictionaryList = async (param) => await siteCenterAdapter.post('/dictionary/queryDictionaryList', param);

// 新增闭店数据
export const addRegions = async (param) => await managerCenterAdapter.post('/shopClose/add', param);
// 修改
export const editRegions = async (param) => await managerCenterAdapter.put('/shopClose/update', param);


// 闭店删除
export const deleteItem = async (param) => await managerCenterAdapter.delete(`/shopClose/delete/${param}`);

// 闭店管理列表
export const regionsPageList = async (param) => await managerCenterAdapter.post('/shopClose/page', param);

// 验证导入的场所excel数据
export const valid = async (param) => await managerCenterAdapter.post('/shopClose/excel/valid', param);

// 保存场所excel数据
export const save = async (param) => await managerCenterAdapter.post('/shopClose/excel/import', param);
// 批量删除
export const batchDeleteReplenishment = async (params) => await managerCenterAdapter.post('/replenishment/batchDeleteReplenishment', params);

