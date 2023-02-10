# 工具方法

## 使用说明
  - import * as util from '@jd/mapbox-react/build/util';
  <!-- - import util from '@jd/mapbox-react' -->

### distance: 计算两点之间的真实距离
  - distance(point1, point2, params)
  - point1, point2: 坐标点 [117.80400390624959, 43.10582860148821]
  - params：其他配置，默认 {units:'kilometers'}

### getCirclePoints: 获取指定圆心和半径的圆形的坐标
  - getCirclePoints(point, distanceInKm)
  - point: 坐标点 [117.80400390624959, 43.10582860148821]
  - distanceInKm: 半径，单位千米。

### getLngLatAngle: 坐标角度计算
  - getLngLatAngle(prev,next)
  - prev，next 坐标点
  
### getLngLatCenter: 两个坐标中心点计算
  - getLngLatCenter(prev,next)
  - prev，next 坐标点

