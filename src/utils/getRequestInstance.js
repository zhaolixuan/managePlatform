/* eslint-disable */
import axios from 'axios';
import { stringify } from 'qs';
import { message } from '@jd/find-react';
import { getQueryString, queryParams } from '@/utils/util'
import { urlFormat } from 'uc-fun';
import { refreshToken } from '@/api/user'
import { PATHS } from '@/router/constant';

// message全局配置，最多显示一个
message.config({
  maxCount: 1,
});

const downloadUrl = ['/guarante/iconForm/excel', '/site/download/yjbgReport', '/carDriver/outExcel', '/guarante/iconForm/download/iconFormExcel', '/suppor-file']

const requireHandle = (config = {}) => {
  // if (cache) {
  //   // eslint-disable-next-line
  //     if (!config.params) config.params = {};
  //   // eslint-disable-next-line
  //     config.params._t = Date.now();
  //   return config;
  // }
  const authorizationToken = sessionStorage.getItem(config.url.startsWith('/gov/swj') ? 'accessTokenForOa' : 'access_token'); // accessTokenForOa: 京办的token
  if (!sessionStorage.getItem('access_token') || !localStorage.getItem('access_token')) return window.location.href = `${process.env.REACT_APP_LOGIN_URL}/#/login?tenantName=领导驾驶舱&returnUrl=${window.location.href}`;
  // eslint-disable-next-line
  config.headers = Object.assign(
    {
      Authorization: config.url.startsWith('/gov/swj') ? `Bearer ${authorizationToken}` : JSON.parse(JSON.parse(authorizationToken).v)
    },
    config.headers,
  );
  if (downloadUrl.includes(config.url) || downloadUrl.filter(item => config.url.includes(item)).length) {
    console.log(config.url);
    config.responseType = 'blob';
  }

  const { method, data, params, param } = config;
  const optionData = data || params || param || {};
  if (method === 'get' || method === 'delete') {
    config.params = optionData;
  } else config.data = optionData;

  return config;
};

const responseHandle = (options = {}) => {
  const { quiet, raw } = options;
  return async (response = {}) => {
    if (response.data.code * 1 === 401 || response.data.code * 1 === 102) {
      if (urlFormat(window.location.href).iframe === 'true') {
        const res = await axios({
          url: `/api/cityos/oauth/web/v2/oauth/sso/refreshToken?refresh_token=${sessionStorage.getItem('refresh_token')}`,
          method: 'post'
        })
        localStorage.setItem('refresh_token', res.data.data.refresh_token);
        sessionStorage.setItem('refresh_token', res.data.data.refresh_token);
        localStorage.setItem('access_token', JSON.stringify({ v: JSON.stringify(`${res.data.data.Bearer} ${res.data.data.access_token}`) }));
        sessionStorage.setItem('access_token', JSON.stringify({ v: JSON.stringify(`${res.data.data.Bearer} ${res.data.data.access_token}`) }));
        window.location.reload();
        return;
      } else {
        message.error(msg1 || msg);
        sessionStorage.removeItem('isLogin');
        window.location.href = `${process.env.REACT_APP_LOGIN_URL}/#/login?tenantName=领导驾驶舱&returnUrl=${window.location.href}`;
      }
    }
    if (raw) return response.data;
    const {
      data: { code, resultCode, data, message: msg1, msg, info, geocodes }
    } = response;
    if (code * 1 === 200 || resultCode === 200 || code * 1 === 0) {
      return data;
    }

    // 兼容经信局的数据格式
    if (info === 'OK') {
      return geocodes;
    }

    !quiet && message.error(msg1 || msg || '服务器错误');
    return Promise.reject(response.data);
  };
};

const getRequestInstance = (baseURL, options = {}) => {
  const { withCredentials = true, ...opts } = options;
  const option = {
    baseURL,
    withCredentials,
    paramsSerializer: (params) => stringify(params, { arrayFormat: 'repeat' }),
    ...opts,
  };
  const instance = axios.create(option);
  // 添加请求拦截器
  instance.interceptors.request.use(requireHandle, (error) => Promise.reject(error));

  instance.interceptors.response.use(responseHandle(), (error) => Promise.reject(error));

  instance.quiet = axios.create(option);
  instance.quiet.interceptors.response.use(responseHandle({ quiet: true }));

  // 原始输出，不需要处理返回值
  instance.raw = axios.create(option);

  instance.raw.interceptors.request.use(requireHandle, (error) => Promise.reject(error));
  instance.raw.interceptors.response.use(responseHandle({ raw: true }));

  return instance;
};

export default getRequestInstance;
