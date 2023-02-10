/* eslint-disable no-unused-vars */
import getRequestInstance from '@/utils/getRequestInstance';
import { domains } from '@/config';

const managerCenterAdapter = getRequestInstance(domains.managerBaseUrl);
const siteCenterAdapter = getRequestInstance(domains.site);

// 查询字典表数据
export const queryDictionaryList = async (param) => await siteCenterAdapter.post('/dictionary/queryDictionaryList', param);

// 保供场所新增
export const addRegions = async (param) => await managerCenterAdapter.post('/regions/add', param);

// 保供场所删除
export const deleteItem = async (param) => await managerCenterAdapter.delete(`/regions/delete/${param}`);

// 保供场所列表
export const regionsPageList = async (param) => await managerCenterAdapter.post('/regions/page', param);

// 验证导入的场所excel数据
export const valid = async (param) => await managerCenterAdapter.post('/regions/excel/valid', param);

// 保存场所excel数据
export const save = async (param) => await managerCenterAdapter.post('/regions/excel/save', param);

// 批量删除
export const batchDeleteRegion = async (params) => await managerCenterAdapter.post('/regions/batchDeleteRegion', params);

