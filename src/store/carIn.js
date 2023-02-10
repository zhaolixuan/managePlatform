/* eslint-disable no-unused-vars */
import { action, runInAction, extendObservable } from 'mobx';
import { message } from '@jd/find-react';
import moment from 'moment';
import * as api from '@/api/carIn';
import { queryDictionaryList } from '@/api/site';
import { getPointPositionData, getTopSixSupplyData } from '@/api/carOut';

// 可观察属性
const OBSERVABLE = {
    siteTypeStatistics: [], // 各种类型场所统计值
    distributeSituation: [], // 今日车辆配运情况
    areaAmount: [],
    directInfoData: [],
    closeShopsData: [],
    carInMaxCount: 0,
    carIncurrentTime: moment().format('YYYY-MM-DD'), // 当前的日期
    carInArea: '', // 当前选择的行政区
    carOutArea: '', // 当前选择的行政区
    siteObj: {}, // 场所定点
    searchKey: '', // 搜索关键字
    carFromOutProvince: [], // 货车清单详情
    areaCarSupplyAmount: [
        {
            // title: '京内',
            title: '市级直通车数量',
            num: 263,
            unit: '辆',
        },
        {
            // title: '京外',
            title: '近一周保障物资',
            num: 657.5,
            // unit: '辆',
            unit: '吨',
        },
    ],
    todaySupplyStatus: [],
    fixedPointData: [],
    destinationPointData: [],
    markerData: {
        markerData: [],
        zoneData: [],
    },
    imageOption: {
        tabTitle: '运货量TOP6',
        hasHead: true,
        imageList: [],
    },
    imageNameList: [],
    destinationSupplyList: [],
    queryAreaCountData: [],
    queryPermitListData: [],
    checkList: []
};

class Store {
    constructor() {
        extendObservable(this, {
            ...OBSERVABLE,
        });
    }

    // 行政区选择
    @action.bound async setArea (area = '') {
        try {
            runInAction(() => {
                this.carInArea = area;
            });
        } catch (error) {
            message.error(error.message);
        }
    }

    // 时间选择
    @action.bound async selectTime (time = '') {
        try {
            runInAction(() => {
                this.carIncurrentTime = time;
            });
        } catch (error) {
            message.error(error.message);
        }
    }

    @action.bound async setSearchKey (key = '') {
        try {
            runInAction(() => {
                this.searchKey = key;
            });
        } catch (error) {
            message.error(error.message);
        }
    }

    // 行政区选择
    @action.bound async selectArea (area = '') {
        try {
            runInAction(() => {
                this.carInArea = area;
            });
        } catch (error) {
            message.error(error.message);
        }
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

    // 各种类型场所统计值
    @action.bound async getDistributeSituation (params = { currentTime: this.carIncurrentTime }) {
        try {
            const res = await api.getDistributeSituation(params);
            runInAction(() => {
                this.distributeSituation = res || [];
            });
        } catch (error) {
            message.error(error.message);
        }
    }

    @action.bound async getAreaAmount (params = { currentTime: this.carIncurrentTime }) {
        try {
            const data = await api.getAreaAmount(params);
            runInAction(() => {
                let id = 1;
                const res = data.map((item) => ({
                    id: id++,
                    ...item,
                }));
                this.areaAmount = res || [];
                this.carInMaxCount = res?.length > 0 ? res[0]?.carCount || 0 : 0;
            });
        } catch (error) {
            message.error(error.message);
        }
    }

    @action.bound async getDirectInfoData (params) {
        try {
            const res = await api.getTrainInfo({
                companyName: params.companyName,
            });

            runInAction(() => {
                this.directInfoData = res || [];
            });
        } catch (error) {
            message.error(error.message);
        }
    }

    @action.bound async getDirectInfoData1 (params) {
        try {
            const res = await api.getPermitInfo({
                companyName: params.companyName,
            });
            runInAction(() => {
                this.directInfoData = res || [];
            });
        } catch (error) {
            message.error(error.message);
        }
    }

    // 直通车企业详情
    @action.bound async enterpriseDetail (params) {
        return await api.getTrainInfo(params);
    }

    // 临时通行证详情
    @action.bound async temporaryDetail (params) {
        return await api.getPermitInfo(params);
    }

    @action.bound async getCloseShopsData (params) {
        try {
            const res = await api.getCloseShops({
                area: this.carInArea,
            });
            runInAction(() => {
                this.closeShopsData = res || [];
            });
        } catch (error) {
            message.error(error.message);
        }
    }

    @action.bound async setIsShowCarFrom (area) {
        runInAction(() => {
            this.carInArea = area;
            if (area) {
                // this.getDirectInfoData();
                this.isShowCarFrom = true;
            } else {
                this.isShowCarFrom = false;
                this.directInfoData = [];
            }
        });
    }

    @action.bound async getPoint (params) {
        try {
            const res = await api.getDestinationPoint({
                carDependency: '',
                receiveArea: '',
                ...params,
            });
            const data = res.filter((item) => this.imageNameList.includes(item.receiveCompany));
            data.length > 0 &&
                Object.assign(data[0], {
                    latitude: data[0]?.receiveLatitude,
                    longitude: data[0]?.receiveLongitude,
                });
            // const data = this.destinationPointData.filter((item) => this.imageNameList.includes(item.receiveCompany));
            runInAction(() => {
                this.siteObj = data?.[0] || {};
            });
        } catch (error) {
            message.error(error.message);
        }
    }

    @action.bound async getAreaCarSupplyAmount (
        params = {
            currentTime: this.carIncurrentTime,
            receiveArea: '',
        },
    ) {
        try {
            const res = await api.getAreaCarSupplyAmount(params);
            const carAmount = [
                {
                    title: '京内',
                    num: res.find((item) => item.carDependency === '京内')?.carCount || 0,
                    unit: '辆',
                },
                {
                    title: '京外',
                    num: res.find((item) => item.carDependency === '京外')?.carCount || 0,
                    unit: '辆',
                },
            ];
            const data = Array.from(carAmount, (item) => ({
                title: `${item.title}货车数量`,
                num: item.num,
                unit: '辆',
            }));
            runInAction(() => {
                this.areaCarSupplyAmount = data;
            });
        } catch (error) {
            message.error(error.message);
        }
    }

    @action.bound async getTodaySupplyStatus (params) {
        try {
            const res = await api.getTodaySupplyStatus({
                currentTime: this.carIncurrentTime,
                carDependency: '',
                receiveArea: '',
                ...params,
            });
            res.sort((a, b) => b?.goodsWeight - a?.goodsWeight);
            runInAction(() => {
                this.todaySupplyStatus = res;
            });
        } catch (error) {
            message.error(error.message);
        }
    }

    @action.bound async getRoadPointPosition (pointTypes = ['8'], area) {
        const types = ['8'];
        try {
            let resInDirectInfo = []
            let resTemporaryPass = []
            // debugger
            // const resInAreaAmount = await api.getAreaAmount({ area: area || this.carInArea });
            if (pointTypes.includes('8') && this.checkList.length && this.checkList.filter(i => i.value == 8)[0]) {
                let area1 = area == 'null' ? null : area
                resInDirectInfo = await api.getDirectInfo({ area: area1 });
            }
            // const resCloseShops = await api.getCloseShops({ area: area || this.carInArea });
            if (pointTypes.includes('京内临时通行证')) {
                resTemporaryPass = await api.getTemporaryPass({ area });
            }
            // const areaAmount = Array.from(resInAreaAmount, (item) => ({
            //   ...item,
            //   markerId: item.id,
            //   type: '蔬菜直通车',
            //   popupType: 9,
            //   lng: item.companyLongitude,
            //   lat: item.companyLatitude,
            //   num: '',
            //   // showPopup: 'false',
            // }));
            console.log(resInDirectInfo, 11223);
            const directInfo = Array.from(resInDirectInfo, (item) => ({
                ...item,
                markerId: item?.id,
                type: '8',
                popupType: 12,
                lng: item?.companyLongitude,
                lat: item?.companyLatitude,
                toolTip: item?.carPlate,
                deptType: item?.deptType ? item?.deptType === 0 ? '市属' : '区属' : '',
                num: '',
                showPopup: 'false',
            }));
            // const closeShops = Array.from(resCloseShops, (item) => ({
            //   ...item,
            //   markerId: item?.id,
            //   type: '关停门店',
            //   popupType: 7,
            //   lng: item?.shopLongitude,
            //   lat: item?.shopLatitude,
            //   num: '',

            // }));
            const temporaryPass = Array.from(resTemporaryPass, (item) => ({
                ...item,
                markerId: item?.id,
                type: '京内临时通行证',
                popupType: 9,
                lng: item?.longitude,
                lat: item?.latitude,
                num: '',
                showPopup: '',
            }));
            // const data = [...areaAmount, ...directInfo, ...closeShops,...temporaryPass].filter((item) => pointTypes.includes(item.type));
            const data = [...directInfo].filter((item) => types.includes(item.type));
            runInAction(() => {
                this.fixedPointData = data;
                const pointData = [...data, ...this.destinationPointData];
                this.markerData = {
                    markerData: pointData,
                    zoneData: [],
                };
            });
        } catch (error) {
            message.error(error.message);
        }
    }

    @action.bound async searchPointPosition (params) {
        try {
            const res = await api.getDestinationPoint({
                carDependency: '',
                currentTime: this.carIncurrentTime,
                receiveCompany: this.searchKey,
                receiveArea: this.carInArea,
                ...params,
            });

            const data = res.map((item) => ({
                markerId: item?.id,
                lng: item?.receiveLongitude,
                lat: item?.receiveLatitude,
                type: '货车数量',
                num: '',
                popupType: 3,
                ...item,
            }));

            runInAction(() => {
                this.destinationPointData = data;
                const pointData = [...data, ...this.fixedPointData];
                this.markerData = {
                    markerData: pointData,
                    zoneData: [],
                };
            });
        } catch (error) {
            message.error(error.message);
        }
    }

    // @action.bound async getPointPosition(pointTypes = ['高速收费站', '冷链卡口']) {
    //   try {
    //     const carRes = await api.queryCarAddress({
    //       carDependency: 0,
    //       currentTime: this.carIncurrentTime,
    //       destination: this.searchKey,
    //     });
    //     console.log('Store carin2');
    //     const res = await getPointPositionData();
    //     console.log('Store carin1');

    //     const highSpeeds = Array.from(res.highSpeeds, (item) => ({
    //       ...item,
    //       markerId: item.id,
    //       type: '高速收费站',
    //       popupType: '',
    //       dataType: 'highSpeeds',
    //       lng: item.longitude,
    //       lat: item.latitude,
    //       num: '',
    //     }));
    //     const regionColds = Array.from(res.regionColds, (item) => ({
    //       markerId: item?.id,
    //       type: '冷链卡口',
    //       popupType: '',
    //       dataType: 'regionColds',
    //       lng: item?.longitude,
    //       lat: item?.latitude,
    //       num: '',
    //       ...item,
    //     }));
    //     const carList = carRes.map((item) => ({
    //       markerId: item?.id,
    //       lng: item?.longitude,
    //       lat: item?.latitude,
    //       type: '车辆',
    //       num: '',
    //       popupType: 1,
    //       ...item,
    //     }));
    //     const data = [
    //       {
    //         markerId: 'beijing',
    //         lng: '116.38',
    //         lat: '39.9',
    //         type: '北京',
    //         num: '',
    //         popupType: '',
    //       },
    //       ...highSpeeds,
    //       ...regionColds,
    //       ...carList,
    //     ].filter((item) => [...pointTypes, '北京', '车辆'].includes(item.type));

    //     console.log('Store carin', data);
    //     runInAction(() => {
    //       this.markerData = data.length
    //         ? {
    //             markerData: data,
    //             zoneData: [],
    //           }
    //         : {
    //             markerData: [],
    //             zoneData: [],
    //           };
    //     });
    //   } catch (error) {
    //     message.error(error.message);
    //   }
    // }

    @action.bound async getTopSixImageOption (type = '2') {
        try {
            const res = await getTopSixSupplyData({ type });
            const imageList = Array.from(res.slice(0, 6), (item) => ({
                ...item,
                title: item.name,
            }));
            const list = imageList.map((item) => item.name);
            runInAction(() => {
                this.imageOption = {
                    tabTitle: '运货量TOP6',
                    hasHead: true,
                    imageList,
                };
                this.imageNameList = list;
            });
        } catch (error) {
            message.error(error.message);
        }
    }

    @action.bound async getDestinationSupplyList (params) {
        const res = await api.getDestinationSupplyList({
            carDependency: '',
            currentTime: this.carIncurrentTime,
            receiveCompany: '',
            ...params,
        });
        runInAction(() => {
            this.destinationSupplyList = res || [];
        });
    }

    @action.bound async queryAreaCount (params) {
        const res = await api.queryAreaCount(params);
        runInAction(() => {
            this.queryAreaCountData = res || [];
        });
    }

    @action.bound async queryPermitList (params) {
        const res = await api.getTemporaryPass(params);
        const resData = res.map(item => ({
            ...item,
            markerId: item?.id,
            type: '京内临时通行证',
            popupType: 9,
            lng: item?.longitude,
            lat: item?.latitude,
            num: '',
            showPopup: false,
        }));
        runInAction(() => {
            this.markerData = {
                markerData: resData,
                zoneData: [],
            };
        });
    }

    // 获取图例
    @action.bound async getCheckBoxData (params, checkData, checkitemArrData) {
        try {
            const res = await queryDictionaryList(params);
            runInAction(() => {
                this.checkList = []
                var arr = []
                res.forEach(i => {
                    if (i.childrenName && checkitemArrData.includes(i.childrenCode * 1)) {
                        arr.push({
                            label: i.childrenName,
                            icon: i.details,
                            value: i.childrenCode,
                        })
                    }

                });
                this.checkList = checkData.concat(arr)
            });
        } catch (error) {

            message.error(error.message);
        }
    }
}

export default new Store();
