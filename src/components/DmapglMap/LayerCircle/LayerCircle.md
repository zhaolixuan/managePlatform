## 使用说明
- 页面中使用组件，设置参数

```
     <LayerCircle
      id='point'
      valueKey='count'
      data={geojson}
     />  
```
## 参数说明
  |  参数   | 说明  | 类型   | 可选值  | 默认值 |
  |  ----  | ----  | ----  | ----  |----  | 
  |  id | 必填标识  | String | --- | 无 |
  |  valueKey | colors,size取值key | String| --- |无 |
  |  style | 支持改变透明的和border | Object | --- | {opacity: 0.3, strokeWidth: 1} |
  |  colors | 根据valueKey及colors数组自动计算，设置图形颜色； 同一颜色/多个颜色  | String/Array |  --- | #c8d2f1 |
  |  sizeBase  | 图形的基础比例，单位为像素；同一大小（sizeLevel无值）；或不同（sizeLevel根据valueKey分为几个范围） | Number | --- | 10 |
  |  sizeLevel | 和sizeBase配合使用 | Number | --- | 无 |
  |  layout  | 图层layout属性，完整配置项参考[mapbox layer circle](https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/?size=n_10_n#circle)  | object  | ----  | ---- |
  |  paint | paint属性配置, 支持circle所有paint相关属性配置，完整配置项参考[mapbox layer circle](https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/?size=n_10_n#circle) | object | --- | paint默认值 |

注: `paint`属性配置优先级高于其他单独参数配置项

注：如果不写sizeBase,sizeLevel,valueKey 默认根据colors设置的第一个颜色值为圆的颜色； 圆的大小根据数据中radius的值设置

## 数据示例
```json
{
  "type": "FeatureCollection",
  "features": [
    { 
      "type": "Feature", 
      "properties": { 
        "id": "ak16994521", 
        "mag": 2.3, 
        "time": 1507425650893, 
        "felt": null, 
        "tsunami": 0,
        "count":1,
        "radius":80 // 自定义半径 
      }, 
      "geometry": { 
        "type": "Point", 
        "coordinates": [ 116.40, 39.90, 0.0 ] 
      } 
    }
  ]
}
```

### 字段说明
- `features`: 每个块包含的数据
- `geometry`: 几何图形; `type`图形类型; `coordinates`点经纬度
- `properties`: 图形包含的属性
