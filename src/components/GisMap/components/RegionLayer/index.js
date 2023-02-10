import { memo, useEffect } from 'react';
const RegionLayer = memo(({ 
     config, map, showProvinces=false, activeArea, right
}) => {
    // 省图层
    const addProvinceData = () => {
        const textSource = {
            type: 'FeatureCollection',
            features: chinaProvinceBoundary.features.map((i) => ({
                type: 'Feature',
                properties: i.properties,
                geometry: {
                    type: 'Point',
                    coordinates: [+i.properties?.centroid?.[0], +i.properties?.centroid?.[1]],
                },
            })),
        }
        if (map.getSource('source-province')) {
            map.getSource('source-province').setData(chinaProvinceBoundary);
        } else {
            map.addSource('source-province', {
                type: 'geojson',
                data: chinaProvinceBoundary
            });
        }
        if (map.getSource('source-province-text')) {
            map.getSource('source-province-text').setData(textSource);
        } else {
            map.addSource('source-province-text', {
                type: 'geojson',
                data: textSource
            });
        }
        !map.getLayer('china-line') && map.removeLayer('china-line') 
        map.addLayer({
            id: 'china-line',
            type: 'line',
            source: 'source-province',
            paint: {
                'line-color': config.provinceColor,
                'line-width': 3,
                'line-opacity': 1,
            },
        })
        !map.getLayer('china-fill') && map.removeLayer('china-fill')
        map.addLayer({
            id: 'china-fill',
            type: 'fill',
            source: 'source-province',
            paint: {
                'fill-color': config.proviceBgColor,
            },
        })
        !map.getLayer('layer-china-line-text') && map.removeLayer('layer-china-line-text')
        map.addLayer({
            id: 'layer-china-line-text',
            type: 'symbol',
            source: 'source-province-text',
            layout: {
                'text-field': ['get', 'name'],
                'text-size': 14,
            },
            paint: {
                'text-color': config.provinceColor,
            },
        })
        map.moveLayer('beijing-background','区界')
        map.moveLayer('china-fill','区界')
        map.moveLayer('china-line','区界')
        map.moveLayer('layer-china-line-text','区界')
        map.fitBounds([[68.73046875, 55.62799595426723],[147.3046875, 13.239945499286312]])
    }

    const getMaxmin = () =>{
        const arr = {}
        bjAreaBoundary.features.forEach(element => {
           let minX= Number.MAX_VALUE , maxX=Number.MIN_VALUE, minY=Number.MAX_VALUE, maxY = Number.MIN_VALUE
           element.geometry.coordinates[0][0].forEach(point =>{
             minX = Math.min(minX, +point[0])
             maxX = Math.max(maxX, +point[0])

             minY = Math.min(minY, +point[1])
             maxY = Math.max(maxY, +point[1])
           })
           arr[element.properties.name]=[[minX,maxY], [maxX, minY]]
        });
    }
    // 北京市图层
    const addCityLayer = () => {
        // getMaxmin()
        const textSource = {
            type: 'FeatureCollection',
            features: bjAreaBoundary.features.map((i) => ({
                type: 'Feature',
                properties: i.properties,
                geometry: {
                    type: 'Point',
                    coordinates: [+i.properties?.centroid?.[0], +i.properties?.centroid?.[1]],
                },
            })),
        }
        if (map.getSource('source-city-beijing')) {
            map.getSource('source-city-beijing').setData(bjAreaBoundary);
        } else {
            map.addSource('source-city-beijing', {
                type: 'geojson',
                cluster: false,
                data: bjAreaBoundary
            });
        }
        if (map.getSource('source-city-district-text')) {
            map.getSource('source-city-district-text').setData(textSource);
        } else {
            map.addSource('source-city-district-text', {
                type: 'geojson',
                data: textSource
            });
        }
        !map.getLayer('layer-beijing-area') && map.removeLayer('layer-beijing-area')
        map.addLayer({
            id: 'layer-beijing-area',
            type: 'fill',
            source: 'source-city-beijing',
            paint: {
                'fill-color': config.proviceBgColor,
                'fill-opacity': 1
            }
        });
        !map.getLayer('layer-beijing-district-text') && map.removeLayer('layer-beijing-district-text')
        map.addLayer({
            id: 'layer-beijing-district-text',
            type: 'symbol',
            source: 'source-city-district-text',
            filter: ['!in', 'name', '北京'],
            layout: {
                'text-allow-overlap': true,
                'text-field': ['get', 'name'],
                'text-size': 16,
            },
            paint: {
                'text-color': config.provinceColor,
            },
        })
        map.moveLayer('beijing-background','区界')
        map.moveLayer('layer-beijing-area','区界')
        // map.moveLayer('layer-beijing-district-text','区界')
    }

    // 北京行政区图层
    const addDistrictLayer = () => {
        const rem = (window.flexible?.rem || 100) / 100
        // 数据源使用北京市图层的
        // 画出边框
        !map.getLayer('layer-district-line') && map.removeLayer('layer-district-line')
        map.addLayer({
            id: 'layer-district-line',
            type: 'line',
            source: 'source-city-beijing',
            filter: ['in', 'name', ''],
            paint: {
                'line-color': config.districtColor,
                'line-width': 8 * rem,
                'line-opacity': 1
            }
        })
        !map.getLayer('layer-district-area-high') && map.removeLayer('layer-district-area-high')
        map.addLayer({
            id: 'layer-district-area-high',
            type: 'fill',
            source: 'source-city-beijing',
            filter: ['in', 'name', ''],
            paint: {
              'fill-color': config.districtColor,
              'fill-opacity': 0.15
            }
          });
    };

    // 北京街道图层
    const addStreetData = () => {
        if (map.getSource('source-street')) {
            map.getSource('source-street').setData(bjStreet);
        } else {
            map.addSource('source-street', {
                type: 'geojson',
                data: bjStreet
            });
        }
        // 绘制街道区域的layer
        // 画出边框
        !map.getLayer('layer-street-line') && map.removeLayer('layer-street-line')
        map.addLayer({
            id: 'layer-street-line',
            // 图层类型
            type: 'line',
            // 数据源
            source: 'source-street',
            paint: {
                'line-color': [
                  'interpolate', ['linear'], ['zoom'],
                  9, 'transparent',
                  10, config.streetColor
                ],
                'line-width': [
                  'interpolate', ['linear'], ['zoom'],
                  5, 1,
                  10, 2,
                  15, 4
                ],
            }
        });
        // !map.getLayer('layer-street-text') && map.removeLayer('layer-street-text')
        // map.addLayer({
        //     id: 'layer-street-text',
        //     type: 'symbol',
        //     source: 'source-street',
        //     layout: {
        //         'text-field': ['get', 'name'],
        //         'text-size': 14,
        //     },
        //     paint: {
        //         'text-color':[
        //             'interpolate', ['linear'], ['zoom'],
        //             11, 'transparent',
        //             12, config.streetColor
        //         ]
        //     }
        // });
        map.moveLayer('beijing-background','区界')
        map.moveLayer('layer-beijing-area','区界')
        map.moveLayer('layer-street-line','区界')
        // map.moveLayer('layer-street-text','区界')
    }

    // 初始化数据
    const addSourceAndLayer = () => {
        if(showProvinces){
            addProvinceData()
        }else{
            addCityLayer();
            addDistrictLayer();
            addStreetData();
            highDistrictLayer();
        }
    }

    // 高亮行政区
    const highDistrictLayer = () => {
        const name = activeArea === '北京' ? '': activeArea
        map.setFilter('layer-district-line', ['in','name', name])
        map.setFilter('layer-district-area-high', ['in','name', name])
        /* eslint-disable */
        const area = bjAreaBoundary.features.filter(el => (activeArea || '北京') === el.properties.name )?.[0]
        const bound = area? area.properties.bound : null
        const rem = (window.flexible?.rem || 100) / 100
        // bound && map.fitBounds(bound, { padding: {top: 150, bottom:10, left: 230, right: 230} })
        const rPannel = right ? typeof right === 'number' ? right : right.replace('px','') : 230
        bound && map.fitBounds(bound, { padding: {top: +rPannel*rem < 100 ? 10 : 150*rem, bottom:10, left: +rPannel*rem, right: +rPannel*rem} })
    }

    useEffect(()=>{
        map && addSourceAndLayer()
    },[])

    useEffect(()=>{
        setTimeout(()=>{
            map && addSourceAndLayer()
        }, 500)
    },[config])

    // 选中区变化时更新高亮
    useEffect(()=>{
        map && highDistrictLayer()
    },[activeArea])

    return (<></>)
},(preProps, nextProps)=>{
    return JSON.stringify({config:preProps.config, showProvinces:preProps.showProvinces, activeArea:preProps.activeArea}) === JSON.stringify({config:nextProps.config, showProvinces:nextProps.showProvinces, activeArea:nextProps.activeArea})
})
export default RegionLayer;
