import { action, runInAction, extendObservable } from 'mobx';
import { message } from '@jd/find-react';
import * as api from '@/api/site';
import { toJS } from 'mobx';
import { getCloseShops } from '@/api/carIn';
import { queryRegionGuaranteed } from '@/api/enclosure';

// 可观察属性
const OBSERVABLE = {
    siteTypeStatistics: [], // 各种类型场所统计值
    gisData: {
        // 给gis地图的点位数据
        markerData: [],
        zoneData: [],
    }, // 给gis地图的数据
    placeNumberList: [], // 场所数量
    marketSaleList: {
        // 折线图数据
        xData: [],
        yData: [],
    },
    pictureSourceList: [], // 八大市场数据
    paramsObj: {
        // 请求地图点位数据
        businessTypes: [],
        businessName: '',
        area: '',
    },
    enclosureCheckList: [],
    checkBoxData: [],
    selsctData:[],

};

class Store {
    constructor() {
        extendObservable(this, {
            ...OBSERVABLE,
        });
    }

    // 各种类型场所统计值
    @action.bound async getSiteTypeStatistics (params = { businessType: '', address: '' }) {
        try {
            const res = await api.getSiteTypeStatistics(params);

            runInAction(() => {
                this.siteTypeStatistics = res || [];
            });
        } catch (error) {
            message.error(error.message);
        }
    }

    // 市场列表
    @action.bound async pictureSource () {
        try {
            const res = await api.pictureSource();
            const resData = res?.map((item) => ({
                title: item?.businessName,
                url: item?.pictureDetails,
                id: item?.id,
                ...item,
            }));
            runInAction(() => {
                this.pictureSourceList = resData || [];
            });
        } catch (error) {
            message.error(error.message);
        }
    }

    // 地图某个点详情
    @action.bound async siteDetails (params) {
        return await api.siteDetails(params);
    }

    // 场所数量
    @action.bound async siteNumber (params = { area: null }) {
        try {
            const res = await api.siteNumber(params);

            runInAction(() => {
                this.placeNumberList = res || [];
            });
        } catch (error) {
            message.error(error.message);
        }
    }

    // 折线图
    @action.bound async marketSale () {
        try {
            await api.marketSale().then((res) => {
                const xData = res?.map((item) => item.landingsDate);
                const yData = res?.map((item) => item.landings);
                runInAction(() => {
                    this.marketSaleList = {
                        xData,
                        yData,
                    };
                });
            });
        } catch (error) {
            message.error(error.message);
        }
    }

    // 搜索和多选框接口
    @action.bound async getSiteLonLat (params = this.paramsObj) {
        try {
            const data = []
            const siteBusinessTypes = params?.businessTypes?.filter(el => !(el === '关停门店' || el === '区级保供场所'))
            const res = await api.getSiteLonLat({
                ...params,
                businessTypes: siteBusinessTypes?.includes(0) ? [1, 2, 3, 4, 5, 6, 7, 8] : siteBusinessTypes,
            });
            /* eslint-disable */
            res && data.push.apply(data, this.filterGisData(res))

            // 关停门店
            if (params?.businessTypes.includes(9)) {
                // console.log('关停门店');
                const closeShopList = await getCloseShops({ area: params.area, businessName: params.businessName });
                /* eslint-disable */
                data.push.apply(data, closeShopList?.map((item) => ({
                    ...item,
                    markerId: item?.id,
                    type: '关停门店',
                    popupType: 7,
                    lng: item?.shopLongitude,
                    lat: item?.shopLatitude,
                    num: '',
                })))
            }

            // 区级保供场所
            if (params?.businessTypes.includes(10)) {
                // console.log('区级保供场所');
                const regionGuaranteedList = await queryRegionGuaranteed({ area: params.area, businessName: params.businessName });
                /* eslint-disable */
                data.push.apply(data, regionGuaranteedList?.map((item) => ({
                    markerId: item?.id,
                    type: '区级保供场所',
                    popupType: 10,
                    lng: item?.longitude,
                    lat: item?.latitude,
                    ...item
                })))
            }
            runInAction(() => {
                this.gisData = data.length
                    ? {
                        markerData: data,
                        zoneData: [],
                    }
                    : {
                        markerData: [],
                        zoneData: [],
                    };
            });
        } catch (error) {
            message.error(error.message);
        }
    }

    // 处理后端返回的点位数据
    @action.bound filterGisData (data = []) {
        const resData = data?.map((item) => {
            return {
                markerId: item?.id,
                lng: item?.longitude,
                lat: item?.latitude,
                type: item?.businessType,
                markerType: item?.businessType,
                num: '',
                popupType: 1,
                ...item,
                url: '',
            };
        });
        console.log(toJS(resData),'======resData');
        return resData;
    }

    // 获取图例
    @action.bound async getCheckBoxData (params, CheckedData,selsctData) {
        try {
            const res = await api.queryDictionaryList(params);
            runInAction(() => {
                this.checkBoxData = []
                let arr = []
                res.forEach(i => {
                    if (i.childrenName) {
                        arr.push({
                            label: i.childrenName,
                            icon: i.details,
                            value: i.childrenCode+'',
                        })
                    }

                });
                this.selsctData = arr.concat(selsctData).sort((a,b)=>{return a.value - b.value})
                this.checkBoxData = arr.concat(CheckedData)
                this.enclosureCheckList = arr.concat(CheckedData)
                console.log(toJS(this.checkBoxData),'======');
            })
        } catch (error) {
            message.error(error.message);
        }
    }

    // 订单数
    @action.bound async orderQuantity (params) {
        return await api.orderQuantity(params);
    }

    @action.bound reset () {
        Object.assign(this, OBSERVABLE);
    }

    @action.bound update (data) {
        Object.assign(this, data);
    }
}

export default new Store();
