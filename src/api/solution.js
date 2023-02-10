import getRequestInstance from '@/utils/getRequestInstance';
import { domains } from '@/config';

const siteCenterAdapter = getRequestInstance(domains.site);

// 保供列表
export const queryChart = async (param) => await siteCenterAdapter.get('/site/queryChart', {param});

// 一表
// export const iconFormList = async (param) => await siteCenterAdapter.post('/guarante/iconForm', param);

// 一表
export const iconFormList = async (param) => await siteCenterAdapter.post('/guarante/iconForm/region', param);

// 一图
export const iconPicture = async (param) => await siteCenterAdapter.post('/guarante/iconPicture', param);

// 保供列表
export const queryBigChart = async (param) => await siteCenterAdapter.get('/site/queryBigChart', { param });

// 下载总表
export const downloadWord = async (param) => await siteCenterAdapter.raw.get('/site/download/yjbgReport', { param });

// // 下载一表
// export const downloadExecl = async (param) => await siteCenterAdapter.raw.post('/guarante/iconForm/excel', param);

// 下载一表
export const downloadExecl = async (param) => await siteCenterAdapter.raw.post('/guarante/iconForm/download/iconFormExcel', param);
