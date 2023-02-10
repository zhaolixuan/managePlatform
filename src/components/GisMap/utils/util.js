import _ from 'lodash';
import { toJS } from 'mobx';
import * as turf from '@turf/turf';

export const getCircleGeo = ({type, center, radius}) => {
    const options = { steps: 50, units: 'kilometers', properties: { type } };
    const circle = turf.circle(center, radius / 1000, options);
    return circle
}

// marker类型图片配置 type
export const typeImageList = {
    企业: 'enterprise-blue',
    1: 'whole-sale-market',
    7: 'market-store',
    2: 'super-market',
    3: 'direct-sale',
    4: 'food-market',
    5: 'lead-warehouse',
    场所: 'site',
    人员: 'staff',
    车辆: 'direct-car',
    封控区: 'ban-dot',
    管控区: 'manage-dot',
    防范区: 'prewarn-dot',
    冷链卡口: 'code-chain',
    高速收费站: 'hignway-station',
    北京: 'beijing',
    出发地: 'direct-car',
    隔离: 'red-status',
    弹窗: 'yellow-status',
    白名单: 'white-status',
    企业白名单: 'white-status',
    正常: 'white-status',
    货车数量: 'car-num-popup',
    6: 'electric-supplies-warehouse',
    临时管控区: 'temporary-manage-area',
    8: 'vegetable-car',
    9: 'close-shop',
    京内临时通行证: 'temporary-pass',
    10: 'zone-supply-site',
    缺补货: 'stockout'
};

export const pointsTransferGeo = (data) => {
    return {
        type: 'FeatureCollection',
        features: data?.map((i) => ({
          type: 'Feature',
          properties: {
            ...i,
            id: i.id || _.uniqueId('id-default'),
            iconType: `${typeImageList[i.type]}-icon`,
            iconNum: i.num
          },
          geometry: {
            type: 'Point',
            coordinates: [+i.lng, +i.lat],
          },
        })),
    };
}
