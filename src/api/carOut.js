import getRequestInstance from '@/utils/getRequestInstance';
import { domains } from '@/config';

const carOutAdapter = getRequestInstance(domains.site);

export const getOutCitySupplyData = async () => await carOutAdapter.get('/car/OutCityDetails');

export const getOutCityCarCountData = async () => await carOutAdapter.get('/car/query/carCount');

export const getPointPositionData = async () => await carOutAdapter.get('/car/query/codeAndHighSpeed');

export const getOutCityGoodSupplyData = async (data) => await carOutAdapter.post('/car/query/luckWith', data);

export const getCarFromOutProvinceData = async (data) => await carOutAdapter.post('/car/query/carListByAreaOut', data);

export const getTopSixSupplyData = async (params) =>
  await carOutAdapter.get('/sealing/querySupportImgMappingList', { params });

export const getSupplyFromPositionData = async (params) => await carOutAdapter.get('/car/query/line', { params });
