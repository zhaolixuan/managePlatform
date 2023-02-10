/* eslint-disable */
/**
 * 自定地图组件
 * @param {Object}   map 地图实例
 * @param {String}   theme 主题
 * @param {Object}   config 主题色彩配置
 * @param {Array}    data 地图点数据集合
 * @param {Object}   activeMarker 高亮点 
 * @param {Array}    activeMarkerZone 选中高亮区 [{type:'zone',data:[[lng,lat]]},{type:'life', center:[lng, lat], radius:1500},{type:'send', center:[lng, lat], radius:3000}]
 * @param {Function} markerClick 地图marker点击回调
 * @param {Function} easeTo([lng,lat]) 跳转到中心点
 * @param {Function} changeZoom 缩放
 */
 import React, { memo, useEffect, useState } from 'react';
 import _ from 'lodash';
 import { pointsTransferGeo, getCircleGeo, typeImageList } from '../../utils/util'
 import Popup from '../Popup';
 
 // import styles from './index.module.less';
 const MarkerLayer = memo(({ config, theme, map, data, activeMarker, activeMarkerZone, markerClick, easeTo, changeZoom, setCarFrom }) => {
    // 设置图片上下文，解决线上环境reqiure找不到图片问题
    const imgCont = require.context('@/assets/map/', true, /.png$/)
    const [marker, setMarker] = useState(activeMarker)

    // 高亮点
    const hightActiveMarker = (marker) => {
        const item = _.isEmpty(marker) ? null: marker
        // 默认点过滤
        map.getLayer('layer-marker-data') && map.setFilter('layer-marker-data', ['!in','id', item?item.id:''])
        // 高亮散点过滤
        map.getLayer('layer-marker-data-highlight') && map.setFilter('layer-marker-data-highlight', ['in','id', item?item.id: '']) 
        item && changeZoom && changeZoom('', 12)
        item && easeTo && easeTo(!item?null:[+item.lng, +item.lat])
    }
    // 地图Marker点击事件
    const handleMarkerClick = (e) => {
        // 1、popup
        // 2、聚焦
        // 3、回调
        // 4、高亮
        const { features } = e;
        let marker = {}
        if(features && features.length > 0){ // 点击地图上的点
            marker = features[0].properties
        }
        markerClick && markerClick(_.isEmpty(marker)?null:marker)
        if(!_.isEmpty(marker) && marker.showPopup !== 'false' ){
            setMarker(marker) // 设置地图上的点
        }
        // 高亮点
        marker & hightActiveMarker(marker)
        // // 将外省车辆的数据写入store needtodo：待京外车辆有数据后进行验证
        // Object.keys(marker).length>0 && setCarFrom && setCarFrom(marker?.province)
    }
    // 加载所需要Marker点图标
    const loadMarkerImages = async () => {
        await Promise.all(
            Object.values(typeImageList)?.map( (el) =>
                new Promise((resolve) => {
                    if (map.hasImage(`${el}-icon`)) return resolve();
                    const img = imgCont(`./${theme}/${el}-icon.png`)
                    map.loadImage( img, (error, res) => {
                        if (error) throw error;
                        map.addImage(`${el}-icon`, res);
                        resolve();
                    });
                }),
            )
        );
    }
    // 添加地图点层
    const addDataLayer = async(list) => {
        const markers = !data || data.length === 0 ? list : data
        // 转数据
        const dataSource = pointsTransferGeo(markers || [])
        // 添加map数据源
        if(map.getSource('source-marker-data')){
            map.getSource('source-marker-data').setData(dataSource);
            map.getSource('source-marker-data-text').setData(dataSource);
        } else {
            map.addSource('source-marker-data', {
                type: 'geojson',
                cluster: false,
                data: dataSource
            });
            map.addSource('source-marker-data-text', {
                type: 'geojson',
                cluster: false,
                data: dataSource
            });
        }

        // 添加散点默认样式
        if(!map.getLayer('layer-marker-data')){
            map.addLayer({
                id: 'layer-marker-data',
                type: 'symbol',
                source: 'source-marker-data',
                filter: ['!in', 'id', ''],
                layout: {
                    'icon-image': ['get', 'iconType'],
                    'icon-size': 0.3,
                    'icon-anchor': 'bottom',
                    'icon-allow-overlap': true,
                    "icon-ignore-placement": true
                }
            });
        }
        // 添加散点高亮样式
        if(!map.getLayer('layer-marker-data-highlight')){
            map.addLayer({
                'id': 'layer-marker-data-highlight',
                'type': 'symbol',
                'source': 'source-marker-data',
                filter: ['in', 'id', ''],
                layout: {
                    'icon-image': ['get', 'iconType'],
                    'icon-size': 1,
                    'icon-anchor': 'center',
                    'icon-allow-overlap': true
                }
            });
        }
        // 添加散点放大层级文字样式
        if(!map.getLayer('layer-marker-data-text')){
            map.addLayer({
                'id': 'layer-marker-data-text',
                'type': 'symbol',
                'source': 'source-marker-data-text',
                filter: ['!in', 'id', ''],
                layout: {
                    // 'text-allow-overlap': true,
                    'text-field': ['get', 'businessName'],
                    'text-size': 12,
                    'text-offset': [0,-4.8]
                },
                paint: {
                    'text-color':[
                        'interpolate', ['linear'], ['zoom'],
                        11, 'transparent',
                        11.1, config.makerTextColor
                      ]
                }
            });
        }
        map && map.on('click', 'layer-marker-data', handleMarkerClick);
    }
    // 添加3圈层
    const addThreeCircleLayer = (data) => {
        if (!data || data === {}){
        removeThreeCircleLayer()
            return;
        };
        let source = []
        activeMarkerZone.forEach((el) => {
            if(el.type === 'life' || el.type === 'send'){
                source.push(getCircleGeo(el))
            }else{
                source.push({...el.data, properties: {type: 'zone'}})
            }
        })
        const dataSource = {
            "type": "FeatureCollection",
            "features": source
        }
        // 添加map数据源
        if(map.getSource('source-marker-region')){
            map.getSource('source-marker-region').setData(dataSource);
        } else {
            map.addSource('source-marker-region', {
                type: 'geojson',
                data: dataSource
            });
        }

        // 添加区管控区域默认样式
        if(!map.getLayer('layer-marker-zone-region-line')){
            map.addLayer({
            id: 'layer-marker-zone-region-line',
            type: 'line',
            source: 'source-marker-region',
            filter: ['in', 'type', 'zone'],
            paint: {
                'line-color': config.zoneRangeColor,
                'line-width': 6,
                'line-opacity': 1,
                'line-dasharray': [2, 1]
            }
            });
            map.addLayer({
            id: 'layer-marker-zone-region-area',
            type: 'fill',
            source: 'source-marker-region',
            filter: ['in', 'type', 'zone'],
            paint: {
                'fill-color': config.zoneRangeColor,
                'fill-opacity': 0.2,
            }
            });
        }

        // 添加生活圈默认样式
        if(!map.getLayer('layer-marker-life-region-line')){
        map.addLayer({
            id: 'layer-marker-life-region-line',
            type: 'line',
            source: 'source-marker-region',
            filter: ['in', 'type', 'life'],
            paint: {
                'line-color': config.lifeRangeColor,
                'line-width': 6,
                'line-opacity': 1,
                'line-dasharray': [2, 1]
            }
            });
            map.addLayer({
            id: 'layer-marker-life-region-area',
            type: 'fill',
            source: 'source-marker-region',
            filter: ['in', 'type', 'life'],
            paint: {
                'fill-color': config.lifeRangeColor,
                'fill-opacity': 0.2,
            }
            });
    }
    // 添加区管控区域默认样式
    if(!map.getLayer('layer-marker-send-region-line')){
        map.addLayer({
            id: 'layer-marker-send-region-line',
            type: 'line',
            source: 'source-marker-region',
            filter: ['in', 'type', 'send'],
            paint: {
                'line-color': config.sendRangeColor,
                'line-width': 6,
                'line-opacity': 1,
                'line-dasharray': [2, 1]
            }
            });
            map.addLayer({
            id: 'layer-marker-send-region-area',
            type: 'fill',
            source: 'source-marker-region',
            filter: ['in', 'type', 'send'],
            paint: {
                'fill-color': config.sendRangeColor,
                'fill-opacity': 0.2,
            }
            });
    }
    }
    // 删除生活圈
    const removeThreeCircleLayer = () =>{
        !activeMarkerZone && map.getSource('source-marker-region') && map.getSource('source-marker-region').setData({"type": "FeatureCollection","features": []});
    }
    // 删除图片
    const removeImage = () => {
        Object.values(typeImageList)?.map( (el) => {
            if (map.hasImage(`${el}-icon`)) map.removeImage(`${el}-icon`);
        })
    }
    // 删除数据图层及监听
    const removeDataLayerAndLiseners = () => {
        map.getSource('source-marker-data') && map.getSource('source-marker-data').setData({});
        map.getSource('source-marker-data-text') && map.getSource('source-marker-data-text').setData({});
        map.off('click', 'layer-marker-data', handleMarkerClick);
        map.off('click', handleMarkerClick); // 地图空白处点击监听
        
    }
    // popup关闭回调
    const handlePopupClose = () => {
        // TODO 干点啥
        setMarker(null)
    }
    // 删除图层及监听
    const removeLayersAndLiseners = () => {
        removeThreeCircleLayer()
        removeDataLayerAndLiseners()
        map.off('click', handleMarkerClick);
        setMarker(null)
    }

    // 初始化加载
    const init = () => {
        map && loadMarkerImages();
        map && removeLayersAndLiseners();
        map && addDataLayer();
        map && map.on('click', handleMarkerClick);
    }
    // 初始化，更新地图上散点
    useEffect(()=>{
        init()
        return () => {
            removeLayersAndLiseners();
        };
    },[])

    useEffect(()=>{
        map && removeImage()
        setTimeout(()=>{init()}, 500)
        return () => {
            removeLayersAndLiseners();
        };
    },[config?.makerTextColor, theme])

    // 数据更新时，更新地图上散点
    useEffect(()=>{
        setMarker()
        map && removeLayersAndLiseners();
        map && map.on('click', handleMarkerClick);
        map && data && addDataLayer();
        return () => {
            removeLayersAndLiseners();
        };
    },[data])

    // 选中地国上marker时刷新地图上数据
    useEffect(()=>{
        map && hightActiveMarker(marker)
    },[marker])

    // 选中地国上marker时刷新地图上数据
    useEffect(()=>{
        console.log('activeMarker', !data, !_.isEmpty(activeMarker))
        // 图例没有选择数据并且activeMarker有数据即选择中右侧表格数据
        map && (!data || data.length === 0) && !_.isEmpty(activeMarker) && addDataLayer([activeMarker])
        map && setMarker(_.isEmpty(activeMarker)?null:activeMarker)
    },[activeMarker])
 
     // 3圈数据更新时，更新地图上散点
    useEffect(()=>{
        map && addThreeCircleLayer(activeMarkerZone);
    },[activeMarkerZone])

    return(
    <>
        {map && marker?.showPopup !== 'false' && <Popup data={marker} onPopupClose={handlePopupClose} theme={theme}/>}
    </>
    )
 },(preProps, nextProps)=>{
     return JSON.stringify({config:preProps.config, activeMarker:preProps.activeMarker, activeMarkerZone:preProps.activeMarkerZone, theme: preProps.theme}) === JSON.stringify({config:nextProps.config, activeMarker:nextProps.activeMarker, activeMarkerZone:nextProps.activeMarkerZone, theme: nextProps.theme}) && preProps.data?.length === nextProps.data?.length
 });
 
 export default MarkerLayer;
