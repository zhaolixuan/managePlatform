/* eslint-disable array-callback-return */
/* eslint-disable no-restricted-syntax */
import * as turf from '@turf/turf';

export { usePrevious , useProperty } from './hooks';

// 计算两点之间的真实距离
export function distance(point1, point2, params) {
  return turf.distance(
    turf.helpers.point(point1),
    turf.helpers.point(point2),
    {
      units: 'kilometers',
      ...params
    }
  );
}

// 获取指定圆形的坐标
export function getCirclePoints(point, distanceInKm) {
  const p = turf.circle(point, distanceInKm);
  p.properties = {
    center: point,
    isCircle: true,
    radiusInKm: distanceInKm
  };
  return p;
}

export function randomId() {
  return performance
    .now()
    .toString()
    .replace('.', '');
}

// 根据数字大小获取尺寸
export function getLevelSize({
  minSize = 10,
  maxSize = 100,
  count = 1,
  rule = [
    {
      count: 10,
      size: 25,
    },
    {
      count: 20,
      size: 35,
    },
    {
      count: 50,
      size: 45,
    },
    {
      count: 80,
      size: 55,
    },
    {
      count: 150,
      size: 60,
    }
  ]
}) {
  let result = rule?.[0]?.size;
  rule.sort((a, b) => (b.count - a.count)).forEach((item) => {
    if (count < item.count) {
      result = item.size;
    }
  });
  if (result < minSize) {
    result = minSize;
  }
  if (result > maxSize) {
    result = maxSize;
  }
  return result;
}

// 坐标差值计算
const NUM = 1e14;
const toNumFun = (num) => Number(num.toFixed(14));
export function getLngLatDiff(prev, next, ratio) {
  return toNumFun((next * NUM - prev * NUM) * ratio / NUM);
}
// 坐标中心点
export function getLngLatCenter(a, b) {
  return [
    toNumFun((a[0] + b[0]) / 2),
    toNumFun((a[1] + b[1]) / 2)
  ];
}
// 坐标求和
export function getLngLatAdd(a, b) {
  return toNumFun((a * NUM + b * NUM) / NUM);
}
// 坐标角度计算
export function getLngLatAngle(prev, next) {
  const point1 = turf.point(prev);
  const point2 = turf.point(next);
  return (turf.bearing(point1, point2) + 90);
}
// 判断是否是对象
export function isObject(obj) {
  return typeof obj === 'object' && obj !== null;
}
// 判断两个值是否相等
export function isEqual(obj1, obj2) {
  // 如果其中没有对象
  if (!isObject(obj1) || !isObject(obj2)) {
    return obj1 === obj2;
  }
  // 如果特意传的就是两个指向同一地址的对象
  if (obj1 === obj2) {
    return true;
  }
  // 两个都是对象或者数组，而且不相等
  // 拿到对象key
  const obj1Keys = Object.keys(obj1);
  const obj2Keys = Object.keys(obj2);
  // 先判断长度就可以过滤一些
  if (obj1Keys.length !== obj2Keys.length) {
    return false;
  }
  // 以obj1为基准 和 obj2 一次递归比较
  // eslint-disable-next-line guard-for-in
  for (const key in obj1) {
    // 递归比较当前每一项
    const res = isEqual(obj1[key], obj2[key]);
    // 如果碰到一个不一样的就返回 false
    if (!res) {
      // 跳出for循环
      return false;
    }
  }
  // 否则全相等
  return true;
}
// 减少一级数组嵌套深度
export function flatten(array) {
  const result = [];
  for (let i = 0; i < array.length; i++) {
    if (Array.isArray(array[i])) {
      array[i].map((item) => {
        result.push(item);
      });
       // 处理数组中的元素 ，push到result中
    } 
      result.push(array[i]);
    
  }
  return result;
}

export function isUndefined(val) {
  return typeof val === 'undefined';
}
// lodash get方法
export function get(object, path, defaultVal = 'undefined') {
  // 先将path处理成统一格式
  let newPath = [];
  if (Array.isArray(path)) {
    newPath = path;
  } else {
    // 先将字符串中的'['、']'去除替换为'.'，split分割成数组形式
    newPath = path.replace(/\[/g, '.').replace(/\]/g, '').split('.');
  }

  // 递归处理，返回最后结果
  return newPath.reduce((o, k) => {
    console.log(o, k); // 此处o初始值为下边传入的 object，后续值为每次取的内部值
    return (o || {})[k];
  }, object) || defaultVal;
}

// layer和source卸载
export function removeLayerSource(map,arr){
  if(typeof arr === 'string'){
    // eslint-disable-next-line no-param-reassign
    arr = [arr];
  }
  arr.forEach(lId =>{
    if (map.getLayer(lId)) {
      map.removeLayer(lId);
      console.log('卸载Layer：',lId);
    }
    if (map.getSource(lId)) {
      map.removeSource(lId);
      console.log('卸载Source：',lId);
    }
  });
}