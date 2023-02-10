import getRequestInstance from '@/utils/getRequestInstance';
import { domains } from '@/config';

const siteCenterAdapter = getRequestInstance(domains.site);

export const marketSale = async (param) => await siteCenterAdapter.get('/site/marketSale', param);

// 各种类型场所统计值
export const getSiteTypeStatistics = async (params) =>
  await siteCenterAdapter.post('/site/siteTypeStatistics', { params });

export const getSiteLonLat = async (params) => await siteCenterAdapter.post('/site/siteLonLat', params);

// 场所数量
export const siteNumber = async (params) => await siteCenterAdapter.post('/site/siteNumber', params);

// 市场列表
export const pictureSource = async (params) => await siteCenterAdapter.get('/site/pictureSource', { params });

// 详情
export const siteDetails = async (params) => await siteCenterAdapter.get(`/site/siteDetails/${params}`);

// 订单数量
export const orderQuantity = async (params) => await siteCenterAdapter.post('/site/orderQuantity', params);

// 查询字典表数据
export const queryDictionaryList = async (param) => await siteCenterAdapter.post('/dictionary/queryDictionaryList', param);


// 缺货报警
export const getStockoutWarning = async (params) => await siteCenterAdapter.post('/site/stockoutWarning', params);