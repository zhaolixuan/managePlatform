import getRequestInstance from '@/utils/getRequestInstance';
import { domains, PAGE } from '@/config';

const datashareAdapter = getRequestInstance(domains.datashare);

export const getInterfaceListReq = async ({
  applyStatus,
  searchKey,
  pageNum = 1,
  pageSize = PAGE.size,
  orderProperty,
  orderDirection,
}) =>
  await datashareAdapter.get('/auth/myapis', {
    params: {
      applyStatus,
      searchKey,
      pageNum,
      pageSize,
      orderProperty,
      orderDirection,
    },
  });
