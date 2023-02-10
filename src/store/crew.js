/* eslint-disable */
import { action, runInAction, extendObservable } from 'mobx';
import { message } from '@jd/find-react';
import * as api from '@/api/crew';
import { getAccessTokenForScreen, getStatisticDistrict } from '@/api/gisOther';
import { getSiteLonLat, queryDictionaryList } from '@/api/site';
import LoginPage from '@/components/Login';

// 可观察属性
const OBSERVABLE = {
    screenList: {}, // 配送人员详情及经纬度列表
    coldChainList: {}, // 北京进口非冷链货物从业人员
    querySealingSealingTypeData: [], // 封控类型列表
    gisData: [],// 给gis地图的数据
    imgList: [], // 企业top6数据，目前已废弃
    staffList: [], // 人员概况列表
    stateList: [], // 人员状态及数量
    paramsObj: { // 请求配送人员详情及经纬度列表参数
        companyName: ['正常'],
        address: '',
        area: ''
    },
    accessTokenForOa: '', // 白名单弹窗需要的token
    whitePepoleNumForOa: '', // 白名单弹人数
    whiteText: null, // 白名单弹人数
    checkList: []
};

class Store {
    constructor() {
        extendObservable(this, {
            ...OBSERVABLE,
        });
    }

    // 行政区、企业数量、从业人员数量聚合数据
    @action.bound async getAdministrative () {
        try {
            const res = await api.administrative();
            runInAction(() => {
                this.screenList = res || {};
            });
        } catch (error) {
            message.error(error.message);
        }
    }

    // 北京进口非冷链货物从业人员
    @action.bound async coldChain () {
        try {
            const res = await api.coldChain();
            const { data } = res;
            runInAction(() => {
                this.coldChainList = data || {};
            });
        } catch (error) {
            message.error(error.message);
        }
    }

    // 查询封控类型
    @action.bound async querySealingSealingType (params) {
        try {
            return await api.querySealingSealingType(params);
        } catch (error) {
            message.error(error.message);
        }
    }

    // 查询封控类型
    @action.bound async querySealingSealingTypeList (params) {
        try {
            const res = await api.querySealingSealingType(params);
            runInAction(() => {
                this.querySealingSealingTypeData = res;
            })
        } catch (error) {
            message.error(error.message);
        }
    }

    // 查询各个类型图片数据-type1.人员2.境内车辆3.境外车辆5.场所4.防疫
    @action.bound async querySupportImgMappingList (params) {
        try {
            const res = await api.querySupportImgMappingList(params);
            const { data } = res;
            const resData = data?.splice(0, 6).map((item) => ({
                title: item.name,
                url: item.url,
                id: item?.id,
            }));
            runInAction(() => {
                this.imgList = resData || [];
            });
        } catch (error) {
            message.error(error.message);
        }
    }

    //  获取风控去，管控区，防范区数据，和白名单数据
    @action.bound async screen (type, params = this.paramsObj) {
        const obj = {
            ...params,
            area: params.area === '北京' ? '' : params.area
        }

        this.update({
            paramsObj: obj
        });

        try {
            const arr = ['封控区', '管控区'];
            // const arr1 = ['居家', '正常', '弹窗'];
            const arr1 = ['正常'];
            const arr2 = ['5', '7'];
            const res1Params = arr.filter((item) => obj?.companyName?.includes(item));
            const resParams = arr1.filter((item) => obj?.companyName?.includes(item));
            const res2Params = arr2.filter((item) => obj?.companyName?.includes(item));
            if (type === 'check') {
                let result = [];
                let result1 = [];
                let result2 = [];
                if (resParams.length) {
                    // 白名单数据
                    result = await api.queryCompanyStaffList({
                        area: obj.area,
                        address: params?.address || '',
                        conditionList: resParams || [],
                    });
                }
                if (res1Params.length) {
                    // 获取风控去，管控区，防范区数据
                    const res = await this.querySealingSealingType({ area: obj.area, sealingTypeList: res1Params });
                    result1 = res.map(item => item.areaName).flat(1)
                }
                if (res2Params.length) {
                    // 前置仓、超市门店
                    result2 = await getSiteLonLat({
                        area: obj.area,
                        businessTypes: res2Params
                    });
                }

                runInAction(() => {
                    this.gisData = {
                        markerData: [...this.filterMarkerData(result), ...this.filterMarkerData(result1, 4), ...this.filterMarkerData(result2, 3)],
                        zoneData: [],
                    }
                });
            } else {
                const res = await api.queryCompanyStaffList({
                    area: obj?.area,
                    address: obj?.address || '',
                    conditionList: ["正常"],
                });

                runInAction(() => {
                    this.gisData = res?.length
                        ? {
                            markerData: this.filterMarkerData(res),
                            zoneData: [],
                        }
                        : {
                            markerData: [],
                            zoneData: [],
                        };
                });
            }

        } catch (error) {
            message.error(error.message);
        }
    }

    @action.bound async querySealingList (params) {
        return await api.querySealingList(params);
    }

    @action.bound filterMarkerData (data = [], popupType = 5) {
        if (popupType === 5) {
            const resData = data?.map((item) => {
                return {
                    markerId: item?.id,
                    lng: item?.longitude,
                    lat: item?.latitude,
                    markerType: item?.type,
                    num: '',
                    popupType,
                    ...item,
                    url: '',
                    type: item?.type !== '正常' ? '企业白名单' : item?.type,
                };
            });

            return resData;
        } else if (popupType === 3) {
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

            return resData;
        } else {
            const resData = data?.map((item) => {
                return {
                    markerId: item?.id,
                    lng: item?.longitude,
                    lat: item?.latitude,
                    markerType: item?.sealingType,
                    num: '',
                    popupType,
                    ...item,
                    url: '',
                    type: item?.sealingType,
                };
            });

            return resData;
        }
    }

    // 获取图例
    @action.bound async getCheckBoxData (params, checkData, checkitemArrData) {
        try {
            const res = await queryDictionaryList(params);
            this.checkList = []
            var arr = []
            runInAction(() => {
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

    @action.bound async screenDetail (params) {
        return await api.queryCompanyStaffList(params);
    }

    // 根据类别查询
    @action.bound async queryStaff (params) {
        try {
            const res = await api.queryStaff(params);
            runInAction(() => {
                this.staffList = res || [];
            });
        } catch (error) {
            message.error(error.message);
        }
    }

    // 根据状态查询
    @action.bound async queryState (params) {
        try {
            const res = await api.queryState(params);
            runInAction(() => {
                this.stateList = res || [];
            });
        } catch (error) {
            message.error(error.message);
        }
    }

    @action.bound reset () {
        Object.assign(this, OBSERVABLE);
    }

    @action.bound update (data) {
        Object.assign(this, data);
    }

    // 获取白名单oa系统的鉴权
    @action.bound async getAccessTokenForScreenApi (params) {
        try {
            const res = await api.getToken();
            // const {records: whiteList} = await getStatisticDistrict();
            if (res) {
                sessionStorage.setItem('accessTokenForOa', res);
                runInAction(() => {
                    this.accessTokenForOa = res || '';
                });
                return res || '';
            }
        } catch (error) {
            message.error(error.message);
        }
    }

    // 获取白名单数量
    @action.bound async getWhiteListForScreenApi ({ area = '' }) {
        try {
            const res = await api.thirdpartygov();
            if (res.length) {
                // const {records: whiteList} = res
                runInAction(() => {
                    let sum = 0; // 在册总人数
                    let obj = null; // 在册总人数
                    if (area && area !== "北京") { // 各区
                        sum = res.find(({ districtName }) => districtName === area)?.activeUserCount
                        obj = res.find(({ districtName }) => districtName === area)
                    } else {
                        // sum = whiteList.reduce((sum,{ activeUserCount })=>{
                        //   return sum + activeUserCount;
                        // },0)
                        sum = res.find(({ districtName }) => districtName === '合计')?.activeUserCount
                        obj = res.find(({ districtName }) => districtName === '合计')
                    }
                    this.whitePepoleNumForOa = sum;
                    this.whiteText = obj;
                });
                // return ;
            }
        } catch (error) {
            message.error(error.message);
        }
    }


}

export default new Store();
