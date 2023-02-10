## 组件说明
标记组件，标记内容支持原生Element和ReactElement，默认为一个浅蓝色圆形。

## 参数说明
  |  参数   | 说明  | 类型   | 可选值  | 默认值 | 
  |  ----  | ----  | ----  | ----  |----  |
  |  LngLat  | 坐标  | LngLatLike  | ----  |----  |
  |  draggable  | 是否可以拖拽  | boolean  | ----  | false  |
  |  anchor  | 哪个部位距离坐标点最近  | string  | 'center' , 'top' , 'bottom' , 'left' , 'right' , 'top-left' , 'top-right' , 'bottom-left' ,'bottom-right'  | center  |
  |  offset  | 元素中心偏移的像素数  | number[]  | ----  | ----  |
  |  color  | 默认圆形颜色  | string  | ----  | '#51bbd6'  |
  |  onClick  | 点击的回调  | (event: any) => void  | ----  | ----  |
  |  onDoubleClick  | 双击的回调  | (event: any) => void  | ----  | ----  |
  |  onMouseEnter  | 鼠标移入的回调  | (event: any) => void  | ----  | ----  |
  |  onMouseLeave  | 鼠标移出的回调  | (event: any) => void  | ----  | ----  |
  
## 数据示例 

```json
[
  {
    LngLat:[115.20, 39.56], //标记点坐标
    element: ele, // 同参数说明
    anchor:'center', // 同参数说明
    offset:[-2,-2], // 同参数说明
    onClick:(e)=>{} // marker点击回调
    onMouseEnter:(e)=>{} // marker鼠标移入
    onMouseLeave:(e)=>{} // marker鼠标移出
    onDoubleClick:(e)=>{} // marker 双击
  },
  ...
]
```
