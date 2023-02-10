/* eslint-disable no-unused-vars */
import getRequestInstance from '@/utils/getRequestInstance';
import { domains } from '@/config';

const oaScreenAdapter = getRequestInstance(domains.oaScreen);
const ssoAdapter = getRequestInstance(domains.sso);

// 地图popup弹窗中，更多的功能
const apiUrl = {
  // 类型1:超市2:批发市场3:社区菜市场4:重点电商5:电商
  type1: '/fgwWholesalePrice/bgWhole',
  type2: '/supermarketVegePrice/bgsupermarketVegePrice',
  type3: '/vegePriceZy/bgvegePriceZy',
  type4: '/vegePrice/bgvegePrice',
};

// 获取更多服务对应的token
export const getToken = async (param) => await ssoAdapter.raw.get('/getTokens', { param });
// 跳转
export const gotoShowMore = async ({ businessName, businessType } = {}) => {
  businessType < 5 &&
    window.open(
      `${domains.manager}${apiUrl[`type${businessType}`]}?company=${businessName}&gunsToken=${localStorage.getItem(
        'showMoreToken',
      )}`,
    );
};

// 京办 - 白名单弹窗
// 鉴权接口
export const getAccessTokenForScreen = async (params) =>
  await oaScreenAdapter.post('/gov/swj/whiteList/openapi/getAccessTokenForScreen', params);
// 白名单人数
export const getStatisticDistrict = async (params) =>
  await oaScreenAdapter.get('/gov/swj/whiteList/openapi/statisticDistrict', {params});
