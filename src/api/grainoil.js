import getRequestInstance from '@/utils/getRequestInstance';
import { domains } from '@/config';

const siteCenterAdapter = getRequestInstance(domains.managerBaseUrl);

export const save = async (param) => await siteCenterAdapter.post('/necessary/store/excel/save', param);

export const queryList = async (params) => await siteCenterAdapter.post('/necessary/store/query', params);

