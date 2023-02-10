import { isEqual, pick } from 'lodash';
import qs from 'qs';
import Axios from 'axios';

export const isLngLat = (lng = 0, lat = 0) =>
  lat !== null &&
  lng !== null &&
  Number(lng) &&
  Math.abs(Number(lng)) > 0 &&
  Math.abs(Number(lng)) < 180 &&
  Number(lat) &&
  Math.abs(Number(lat)) > 0 &&
  Math.abs(Number(lat)) < 90;

export const fitBounds = (map, nextData) =>
  setTimeout(() => {
    const mapCache = map;
    const list = nextData.filter(({ lng, lat }) => isLngLat(lng, lat));
    if (list.length > 1) {
      mapCache.fitBounds(
        list.map((item) => [item.lat, item.lng]),
        { padding: [150, 100] },
      );
    }
  }, 1000);

export const array2obj = (arr = [], key) =>
  arr.reduce(
    (pre, cur) => ({
      ...pre,
      [cur[key]]: cur,
    }),
    {},
  );

export const createRandomId = (key) => `${key}_${Math.floor(Math.random() * 100000)}_${new Date().getTime()}`;

export const isPureEqual = (marker1, marker2) => {
  const list1 = marker1.map(({ icon, ...item }) => item);
  const list2 = marker2.map(({ icon, ...item }) => item);
  return isEqual(list1, list2);
};

export const queryParams = qs.parse(window.location.hash.replace(/#\/[\w|\d]+\?/, ''));
// 获取url中的参数
export const getQueryString = (name) => queryParams[name];

// 判断字符串是否合法， 合法则显示， 否则不显示
export const validateText = (text) => (text !== 0 && !text ? '-' : text);

export const getNotEmptyValue = (params = {}) =>
  pick(
    params,
    Object.keys(params).filter((key) => !!params[key] || params[key] === 0),
  ); // 用lodash 的 pick取出非空值的参数, 考虑值为 0 的情况。

// eslint-disable-next-line prefer-destructuring
const document = window.document;
// 展开/全屏
export function requestFullScreen(id) {
  const element = document.getElementById(id);
  const requestMethod =
    element.requestFullscreen ||
    element.webkitRequestFullscreen ||
    element.msRequestFullscreen ||
    element.mozRequestFullScreen;
  if (requestMethod) {
    requestMethod.call(element);
  }
}
// 退出/全屏
export function exitFullScreen() {
  const exitMethod =
    document.exitFullscreen ||
    document.webkitExitFullscreen ||
    document.msExitFullscreen ||
    document.mozCancelFullScreen;
  if (exitMethod) {
    exitMethod.call(document);
  }
}
// 判断是否全屏
export function isFullscreenElement() {
  const isFull =
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.msFullscreenElement ||
    document.mozFullScreenElement;
  return !!isFull;
}

export const jsWakeUp = (src) => {
  const iframe = document.createElement('iframe');

  iframe.style.display = 'none';
  iframe.src = src;
  document.body.appendChild(iframe);
  setTimeout(() => {
    document.body.removeChild(iframe);
  }, 3e3);
};

export const downloadExcel = (downloadContent, fileName, type) => {
  const blob = new Blob([downloadContent], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' }); // application/vnd.openxmlformats-officedocument.spreadsheetml.sheet这里表示xlsx类型
  const downloadElement = document.createElement('a');
  const href = window.URL.createObjectURL(blob); // 创建下载的链接
  downloadElement.href = href;
  downloadElement.download = typeof fileName !== 'undefined' ?  type ? `${fileName}.${type}` : `${fileName}` : `${new Date().getTime()}未定义文件名`; // 下载后文件名
  // downloadElement.download = typeof fileName !== 'undefined' ? `${fileName}` : `${new Date().getTime()}${fileType}`; // 下载后文件名
  document.body.appendChild(downloadElement);
  downloadElement.click(); // 点击下载
  document.body.removeChild(downloadElement); // 下载完成移除元素
  window.URL.revokeObjectURL(href); // 释放掉blob对象
};


