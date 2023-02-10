/**
 * react render
 *
 * 1. dsl 渲染页面
 * 2. 拖拽
 * */
import React from 'react';
import { Render, configuration } from '@jd/lcdp-react-render';
import { toJS } from 'mobx';
import { useHistory } from 'react-router-dom';
import zhCN from '@jd/find-react/es/locale/zh_CN';
import * as FindComps from '@jd/find-react/es';
// import utils from '../utils/index';
import '@jd/find-react/dist/@jd/find-react.min.css';

const Demo = ({ msg }) => (
  <div>
    <h1>this is d111emo</h1>
    {msg}
  </div>
);

configuration.init({
  components: {
    ...FindComps,
    Demo,
  },
});

// 内置行为
const buildinAction = {
  message: FindComps.message,
  modal: FindComps.Modal,
  // utils,
  toJS,
};

const customStore = {
  buildinAction,
};

export default function LocalRender({ dsl, ...props }) {
  const history = useHistory();
  customStore.buildinAction.history = history;
  const { loginPath = '', baseURL = '' } = window.GLOBAL_CONFIG;
  console.log('process.env.NODE_ENV=>', process.env.NODE_ENV);

  return (
    <FindComps.ConfigProvider locale={zhCN}>
      <Render
        config={dsl.apiConfigs}
        customStore={customStore}
        dsl={dsl}
        {...props}
        interceptors={(adapter) => {
          adapter.interceptors.request.use(
            (config) => {
              const token = sessionStorage.getItem('token')
              // const { v: token } = JSON.parse(window.localStorage.getItem('access_token') || '');
              // eslint-disable-next-line no-param-reassign
              config.headers.Authorization  = `Bearer ${token}`
              // eslint-disable-next-line no-param-reassign
              config.url = `${baseURL}${config.url}`;
              return config;
            },
            (error) => Promise.reject(error),
          );
          adapter.interceptors.response.use(
            (response) => {
              // eslint-disable-next-line prefer-const
              const {
                data: { code, data, message },
              } = response;
              // console.log('response.data=>', response.data);

              if (code === 200 || code === 0) {
                return data;
              }
              if (code === 101 || code === 102 || code === 403) {
                buildinAction.message.warning('登录过期/没有权限，请重新登录', 2, () => {
                  window.location.href = loginPath; // 将来调用app壳上的登陆api，跳转到登陆页面
                });
              }
              buildinAction.message.error(message);
              return Promise.reject(response.data);
            },
            (error) => Promise.reject(error),
          );
        }}
      />
    </FindComps.ConfigProvider>
  );
}
