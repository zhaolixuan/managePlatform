import getRequestInstance from '@/utils/getRequestInstance';
import { domains } from '@/config';

const carInCenterAdapter = getRequestInstance(domains.site);

export const marketSale = async (param) => await carInCenterAdapter.post(`/site/marketSale/${type}`, param);

export const getSiteTypeStatistics = async (params) =>
  await carInCenterAdapter.get('/site/siteTypeStatistics', { params });

export const getSiteLonLat = async (params) => await carInCenterAdapter.post('/site/siteLonLat', params);

export const siteNumber = async (params) => await carInCenterAdapter.get('/site/siteNumber', { params });

export const getDistributeSituation = async (params) => await carInCenterAdapter.get('/car/query', { params });

export const getAreaAmount = async (params) =>
  await carInCenterAdapter.get('/car/query/direct/count', { params });

export const getDirectInfo = async (data) =>await carInCenterAdapter.post('/car/query/direct/info', data);



export const getCloseShops = async (data) =>
  await carInCenterAdapter.post('/car/query/shop/close', data);

  export const getTemporaryPass = async (data) =>
  await carInCenterAdapter.post('/permit/queryPermitList', data);

export const getAreaCarSupplyAmount = async (params) => await carInCenterAdapter.get('/car/query/count', { params });

export const getTodaySupplyStatus = async (data) => await carInCenterAdapter.post('/car/query/goods', data);

export const getDestinationPoint = async (data) => await carInCenterAdapter.post('/car/query/company', data);

export const getDestinationSupplyList = async (data) =>
  await carInCenterAdapter.post('/car/query/receiveCompany', data);

export const queryCarAddress = async (params) => await carInCenterAdapter.get('/car/query/address', { params });

export const getCarStatisticData = async (params) => await carInCenterAdapter.get(`/car/throughTrainWeekStatistics`,{params});  //直通车周统计
export const getCarAmountData = async () => await carInCenterAdapter.get('/car/carStatisticsByArea' );  
export const getTrainCompaniesData = async (params) => await carInCenterAdapter.get(`/car/throughTrainCompanies`, { params } );  //直通车企业企业列表
export const getTrafficPermitCompaniesData = async (params) => await carInCenterAdapter.get(`/car/trafficPermitCompanies`, { params } );   //临时通行证企业列表

export const getTrainInfo = async (params) => await carInCenterAdapter.get('/car/throughTrainCompanyDetail', {params});  //直通车企业详情

export const getPermitInfo = async (params) =>await carInCenterAdapter.get('/car/trafficPermitCompanyDetail', {params});   //临时通行证详情



export const getOverviewData = async (params) => await carInCenterAdapter.get(`/car/overview`, { params } );   //总览

export const queryAreaCount = async (params) => await carInCenterAdapter.get('/permit/queryAreaCount', { params } );



// export const queryPermitList = async (params) => await carInCenterAdapter.post('/permit/queryPermitList', params );
