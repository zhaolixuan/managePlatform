import getRequestInstance from '@/utils/getRequestInstance';
import { domains } from '@/config';
const dataUploadCenterAdapter = getRequestInstance(domains.managerBaseUrl);
const dataOssCenterAdapter = getRequestInstance(domains.oss);

// export const marketSale = async (param) => await dataUploadCenterAdapter.get('/site/marketSale', param);

// 查询列表
export const getList = async (params) => await dataUploadCenterAdapter.post('/statistics/getList', params);

// 提交
export const submit = async (params) => await dataUploadCenterAdapter.post('/statistics/saveBatch', params);

// 查字典
export const getCodeList = async (params) => await dataUploadCenterAdapter.post('/dictionary/queryListByParentCodeList', params);

// 下载文件
export const downLoad = async (params) => await dataOssCenterAdapter.raw.get(params);

