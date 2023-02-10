// Generated with util/create-component.js\
import React, {Component} from 'react';
import withMap from '../BaseMap/withmap';
import {MarkerClusterProps} from './MarkerCluster.types';
import Marker from '../Marker';
import {isEqual,removeLayerSource} from '../util';

class Cluster extends Component<MarkerClusterProps, any> {
    markers: {};

    clusterId: any;

    map: any;

    data: any;

    constructor(props) {
        super(props);
        const {id, map, data} = props;
        this.markers = {}; // 全部创建过的marker
        this.clusterId = id;
        this.map = map;
        this.data = data;
        this.state = {
            markerList: []
        };
    }

    componentDidMount() {
        this.addSource();
        this.addUnclusterLayer();
        this.map.on('zoom', this.updateMarkers);
        this.map.on('move', this.updateMarkers);
        this.updateMarkers();

        this.map.on('sourcedata', this.sourceDataUpdateMarkers);
    }

    componentDidUpdate(prevProps) {
        const {data, clusterRadius, clusterMaxZoom, useCluster} = this.props;
        // 聚合相关参数改变，重设layer source
        // eslint-disable-next-line max-len
        if (!isEqual(prevProps.clusterRadius, clusterRadius) || !isEqual(prevProps.clusterMaxZoom, clusterMaxZoom) || !isEqual(prevProps.useCluster, useCluster)) {
            this.map.removeLayer(this.clusterId);
            this.map.removeSource(this.clusterId);
            this.addSource();
            this.addUnclusterLayer();
            this.setState({
                markerList: []
            });
        }
        if (!isEqual(prevProps.data, data)) {
            this.updateData(data);
            this.updateMarkers();
        }
    }

    componentWillUnmount() {
        this.map.off('zoom', this.updateMarkers);
        this.map.off('move', this.updateMarkers);
        this.map.off('sourcedata', this.sourceDataUpdateMarkers);
        // 图层卸载
        removeLayerSource(this.map,this.clusterId);
    }

    // eslint-disable-next-line react/sort-comp
    updateData(data) {
        this.map.getSource(this.clusterId).setData(data);
        this.setState({
            markerList: []
        });
    }

    onMarkerEnter(e){
        const {params:{cluster}} = e;
        if (cluster) return;
        const { markerEnter } = this.props;
        markerEnter instanceof Function && markerEnter(e);
    }

    onMarkerLeave(e){
        const {params:{cluster}} = e;
        if (cluster) return;
        const { markerLeave } = this.props;
        markerLeave instanceof Function && markerLeave(e);
    }

    onMarkerClick(e){
        const {params:{cluster}} = e;
        const { markerClick } = this.props;
        if (cluster){
            this.clustereOnClick(e);
            return;
        }
        markerClick instanceof Function && markerClick(e);
    }

    sourceDataUpdateMarkers = (e) => {
        // 同时添加多个sourcedata， 通过sourceId 判断会有问题
        if (e.isSourceLoaded) {
            this.updateMarkers();
        }
    }

    updateMarkers = () => {
        const features = this.map.querySourceFeatures(this.clusterId);
        const markerObject = {};
        features.forEach(feature => {
            const {properties} = feature;
            const id = properties.cluster ? `c_${properties.cluster_id}` : `p_${properties.id}`;
            if (!id) {
                console.error('marker 缺少properties：id');
                return;
            }
            let coords = feature.geometry.coordinates;
            if (!properties.cluster && Array.isArray(this.data.features)) {
                const target = this.data.features.find(v => `${v.properties.id}` === `${properties.id}`);
                if (target && target.geometry) { // target 可能不存在，需要加空判断
                    coords = target.geometry.coordinates;
                }
            }
            let marker = this.markers[id];
            if (!marker) {
                const el = this.renderMarker(properties);
                this.markers[id] = {
                    id,
                    onClick: (e) => this.onMarkerClick(e),
                    onMouseEnter: (e) => this.onMarkerEnter(e),
                    onMouseLeave: (e) => this.onMarkerLeave(e),
                    element: el,
                    LngLat: coords,
                    ...properties
                };
                marker = this.markers[id];
            }
            markerObject[id] = marker;
        });
        this.setState({
            markerList: Object.values(markerObject)
        });
    }

    // 聚合点点击
    clustereOnClick({el: {_lngLat}, params}) {
        this.map.getSource(this.clusterId).getClusterExpansionZoom(
            params.cluster_id,
            (err, zoom) => {
                if (err) return;
                this.map.easeTo({
                    center: _lngLat,
                    // zoom+1 因为点击放大时，距离不够会导致querySourceFeatures并不能正确更新到marker层级
                    zoom: zoom + 1
                });
            }
        );
    }

    // 添加source
    addSource() {
        const {clusterMaxZoom = 14, clusterRadius = 50, useCluster = true} = this.props;
        this.map.addSource(this.clusterId, {
            type: 'geojson',
            data: this.data,
            cluster: useCluster,
            clusterMaxZoom,
            clusterRadius,
        });
    }

    // 添加非聚合点图层
    addUnclusterLayer() {
        this.map.addLayer({
            'id': this.clusterId,
            'type': 'circle',
            'source': this.clusterId,
            'filter': ['!=', 'cluster', true],
            'paint': {
                'circle-radius': 0
            }
        });
    }

    // 强制刷新
    forceUpdate () {
        const { data } = this.props;
        this.markers = [];
        this.updateData(data);
        this.updateMarkers();
    }

    renderMarker(properties) {
        const {cluster} = properties;
        const {markerFactory, clusterFactory} = this.props;
        if (!(clusterFactory instanceof Function)) {
            console.error('无法匹配聚合点的构建方法 clusterFactory');
            return;
        }
        if (!(markerFactory instanceof Function)) {
            console.error('无法匹配散点的构建方法 markerFactory');
            return;
        }
        if (cluster) {
            return clusterFactory(properties);
        }
            return markerFactory(properties);

    }

    render() {
        const {markerList} = this.state;
        return <>
          {markerList.map((item, idx) => {
                const {element, ...opts} = item;
                return <Marker
                  {...opts}
                  key={`${opts.id} + ${idx}`}
                >{element}</Marker>;
            })}
        </>;
    }
}

export default withMap(Cluster);
