import _ from 'lodash';
import * as turf from '@turf/turf';

export const getCircleGeo = ({type, center, radius}) => {
    const options = { steps: 50, units: 'kilometers', properties: { type } };
    const circle = turf.circle(center, radius / 1000, options);
    return circle
}

// marker类型图片配置 type
export const typeImageList = {
    企业: 'enterprise-blue',
    批发市场: 'whole-sale-market',
    超市门店: 'market-store',
    连锁超市: 'super-market',
    直营直供: 'direct-sale',
    社区菜市场: 'food-market',
    前置仓: 'lead-warehouse',
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
    正常: 'white-status',
    货车数量: 'car-num-popup',
    电商大仓: 'electric-supplies-warehouse',
    临时管控区: 'temporary-manage-area',
    蔬菜直通车: 'vegetable-car',
    关停门店: 'close-shop',
    京内临时通行证: 'temporary-pass',
    区级保供场所: 'zone-supply-site',
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