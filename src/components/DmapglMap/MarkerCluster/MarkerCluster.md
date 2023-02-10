# 散点聚合层

## 组件说明
- 支持通过geojson渲染出marker散点列表
- 支持对散点进行聚合
- 支持对设置多个聚合层匹配不同散点类型
- 聚合点和散点支持自定义dom

## 参数说明
  |  参数   | 说明  | 类型   | 可选值  | 默认值 | 备注 | 
  |  ----  | ----  | ----  | ----  |----  | ---- |
  |  id | 必填标识  | String | --- | 无 | --- | 
  |  data | 必填标识  | geojson | --- | 无 | properties中要包含必填值id,作为marker的唯一标识 | 
  |  markerFactory | marker散点构建方法  | object | --- | 无 | 此方法可接受参为geojson中properties对应的数据，需返回html/jsx |
  |  clusterFactory | cluster聚合点构建方法  | object | --- | 无 | 可接受参为cluster聚合数据，包括cluster:true(是否聚合);cluster_id: 5(聚合点id);point_count: 2(聚合数量) |
  |  clusterMaxZoom | 最大聚合层级  | number | --- | 14 | --- |
  |  clusterRadius | 聚合半径  | number | --- | 50 | --- |



## 数据示例
  - 标准的geojson数据即可，其中每条数据的properties中要设置id作为marker的唯一id
  
```json
{
  "type": "FeatureCollection",
  "crs": {
    "type": "name",
    "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" }
  },
  "features": [
    {
      "type": "Feature",
      "properties": {
        "id": "ak16993710",
        "mag": 1.5,
        "time": 1507393418705,
        "felt": null,
        "tsunami": 0
      },
      "geometry": { "type": "Point", "coordinates": [-151.3458, 63.0633, 0.0] }
    },
    {
      "type": "Feature",
      "properties": {
        "id": "ak16993699",
        "mag": 1.6,
        "time": 1507392875390,
        "felt": null,
        "tsunami": 0
      },
      "geometry": { "type": "Point", "coordinates": [-151.4669, 63.0675, 3.4] }
    }
  ]
}

```
