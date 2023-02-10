/* eslint-disable no-console */
/**
 * 接口获取数据的 hooks
 * @param {str} url  接口地址
 * @param {obj} params 请求参数
 * @param {str} method 请求方法
 * @param {any} defaultData 返回数据的默认值
 * @param {fun} validate 参数校验
 * @param {fun} beforeReq 发送请求之前要做的事
 * @param {fun} transform 请求成功后，对数据的格式化转换，在 transformponse 之前执行
 * @param {fun} afterRes 请求成功后的回调
 * @param {fun} errorCatch 请求失败后的自定义捕获操作
 * @param {obj} extraAxiosOptions axios 的其他自定义参数，比如：header
 * @param {array} dependences 依赖的参数
 */
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { message } from '@jd/find-react';
import _ from 'lodash';
import getRequestInstance from '@/utils/getRequestInstance';
import { domains } from '@/config';
import store from '../store';

export { default as useRouter } from './useRouter';

const requestInstance = getRequestInstance(domains.base, { quiet: true }); // quiet: true => 不自动弹出错误信息

export const useFetchData = (
  {
    url,
    params = {},
    method = 'get',
    defaultData,
    validate,
    beforeReq,
    transform = (data) => data,
    afterRes,
    errorCatch,
    extraAxiosOptions = {},
  },
  dependences = [],
) => {
  const [data, setData] = useState(defaultData);
  const preParams = useRef<{ params: any; url: string }>();

  const source = axios.CancelToken.source();

  const options = {
    url,
    [method === 'get' ? 'params' : 'data']: params,
    method,
    cancelToken: source.token, // 作用：可手动取消正在进行的 axios 请求
    ...extraAxiosOptions,
  };

  useEffect(() => {
    const loadData = async () => {
      if (typeof validate === 'function' && !validate()) {
        return;
      }
      typeof beforeReq === 'function' && (await beforeReq());

      try {
        const res = await requestInstance(options as any);
        setData(transform(res));
        typeof afterRes === 'function' && (await afterRes(res));
      } catch (error) {
        // eslint-disable-next-line max-len
        if (axios.isCancel(error)) return console.warn('Request canceled: ', error.message); // 手动取消请求的捕获
        if (typeof errorCatch === 'function') return errorCatch(error); // 自定义异常捕获
        message.error(error.message || '服务器错误'); // 默认异常捕获抛出
      }
    };

    // 监听可变参数
    if (!_.isEqual(preParams.current, { params, url })) {
      loadData();
      preParams.current = { params, url };
    }

    return () => {
      source.cancel('Operation canceled by the user.'); // 组件卸载时，取消正在进行的请求
    };
    // eslint-disable-next-line
  }, [url, params, ...dependences]);

  return [data, setData];
};

/**
 * 通过本工具函数：可在React hook 中便捷使用 mobx
 * usage:
 *  function Component {
 *    const { ... } = useStore('storeName');
 *    ...
 *  }
 *  export default observer(Component);
 *
 * @param {str} name 模块store名称
 */
export const useStore = (name) => {
  const storeContext = React.createContext(store[name] || store);
  return React.useContext(storeContext);
};

/**
 * 判断组件的状态是 ’已挂载（true）‘ 还是 ’已卸载（false）‘
 */
export function useIsMounted() {
  const isMountedRef = useRef(null);
  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  });
  return isMountedRef.current;
}
