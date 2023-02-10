## 组件说明
  浮窗组件，标记内容支持html字符串和ReactElement。组件只对html和LngLat两个参数做了监听更新。

## 参数说明
  |  参数   | 说明  | 类型   | 可选值  | 默认值 | 
  |  ----  | ----  | ----  | ----  | ----  |
  |  html  | 弹窗内容,html字符串或者ReactElement  | ----  | ----  | ----  |
  |  LngLat  | 弹窗坐标  | [number,number]  | ----  | ----  |
  |  className  | 弹窗自定义样式  | string  | ----  | ----  |
  |  anchor  | 弹窗位置  | string  | center, top , bottom , left , right , top-left , top-right , bottom-left ，bottom-right  | bottom  |
  |  closeButton  | 弹窗关闭按钮  | boolean  | ----  | true  |
  |  closeOnClick  | 点击地图时关闭弹窗 | boolean  | ----  | true  |
  |  offset  | 弹窗偏移 | number，PointLike，Object  | ----  | ----  |
  |  maxWidth  | 弹窗最大宽度 | string  | ----  | 300px  |
  |  close  | 弹窗关闭回调 | function  | ----  |   |