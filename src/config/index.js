/* eslint-disable camelcase */
export { default as ENUMS } from './enums';

const { baseURL, outURL, outOaURL, fileUrl, ossUrl } = window.GLOBAL_CONFIG;

export const domains = {
  base: baseURL,
  datashare: `${baseURL}/datashare`,
  usercenter: `${baseURL}/mock-usercenter`,
  site: `${baseURL}/icity-support-screen`,
  managerBaseUrl: `${baseURL}/icity-support-manager`,
  login: `${baseURL}/icity-support-screen`,
  tq_login: '/api/cityos',
  oaScreen: `${outOaURL}`,
  sso: `${outURL}/report-sso${process.env.REACT_APP_BUILD_ENV === 'test' ? '-test' : ''}`,
  manager: `${outURL}/report-manager${process.env.REACT_APP_BUILD_ENV === 'test' ? '-test' : ''}`,
  oss: `${ossUrl}`,
};
// 默认分页查询
export const PAGE = {
  size: 10,
  num: 1,
};

export const LOGIN_ENCRY = {
  key: 'I0YmM5NTgtY2IyYi00OWIzLWFkZCzSxt',
  iv: 'BjNzhiZDctOGMxXT',
};

// gis地图popup中的更多，固定key换取token
export const SHOWMORE_ENCRY = {
  KeysRandom: 'shbxpbgpt',
  account: 'bgpt',
};

// 京办oa，固定用户换取token
export const OA_ENCRY = {
  appId: 'SWJ_SCREEN',
  secret: '$E9uC0P^$$#Z^Ynv',
};

// 开发用的token
// eslint-disable-next-line max-len
export const asscess_token = {"c":1654156292683,"e":253402300799000,"v":"\"Bearer eyJhbGciOiJIUzI1NiJ9.eyJqd3RUeXBlIjoidXNlciIsInVzZXJJZCI6IjExIiwidGVuYW50SWQiOiIxIiwidXNlcm5hbWUiOiJiZWlqaW5nIiwic2Vzc2lvblRva2VuIjoiMGIwZThhYjIzOWZlNDJmNThhZTI5ZDI1ODNmMmJhYzkiLCJpc3MiOiJkcmlnaHQiLCJzdWIiOiJhY2Nlc3NUb2tlbiIsImlhdCI6MTY1NDE1NjIzMiwibmJmIjoxNjU0MTU2MTcyfQ.d6uYNh3NMrHc995b0tLVNzSvNjPgs9YJl71o5FLU8M0\""}

