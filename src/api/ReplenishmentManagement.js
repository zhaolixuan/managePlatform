/* eslint-disable no-unused-vars */
import getRequestInstance from '@/utils/getRequestInstance';
import { domains } from '@/config';

const managerCenterAdapter = getRequestInstance(domains.managerBaseUrl);
const siteCenterAdapter = getRequestInstance(domains.site);

// 查询字典表数据
export const queryDictionaryList = async (param) => await siteCenterAdapter.post('/dictionary/queryDictionaryList', param);

// 缺补货管理新增
export const addRegions = async (param) => await managerCenterAdapter.post('/replenishment/add', param);

// 缺补货管删除
export const deleteItem = async (param) => await managerCenterAdapter.delete(`/replenishment/delete/${param}`);

// 缺补货管列表
export const regionsPageList = async (param) => await managerCenterAdapter.post('/replenishment/page', param);

// 批量删除
export const batchDeleteReplenishment = async (params) => await managerCenterAdapter.post('/replenishment/batchDeleteReplenishment', params);

