// 暗色地图基础配置参数
export const darkMapConfig = {
  zoom: 12,
  maxZoom: 22,
  minZoom: 1,
  center: [116.38, 40.245999],
  height: '100%',
  style: 'zyzx://custom/hvcRzD636NIrG_Y3531qn.json',
  accessToken: 'pk.eyJ1IjoiZ2Vla21lbmciLCJhIjoiY2wycGl1N240MDJtMjNsbGxreHQ1djJ4cCJ9.YkDbefaadVj8rTfbFM-stA',
};

// 亮色地图基础配置参数
export const lightMapConfig = {
  zoom: 12,
  maxZoom: 22,
  minZoom: 5,
  center: [116.38, 40.245999],
  height: '100%',
  style: 'zyzx://custom/Jo_hjtwy_3s3QrWnJaEuQ.json', 
  accessToken: 'pk.eyJ1IjoiZ2Vla21lbmciLCJhIjoiY2wycGl1N240MDJtMjNsbGxreHQ1djJ4cCJ9.YkDbefaadVj8rTfbFM-stA',
};

// ========================================================================================================
const commonMap = {
  zoom: 8,
  maxZoom: 22,
  minZoom: 3,
  center: [116.38, 40.245999],
  height: '100%',
  accessToken: 'pk.eyJ1IjoiZ2Vla21lbmciLCJhIjoiY2wycGl1N240MDJtMjNsbGxreHQ1djJ4cCJ9.YkDbefaadVj8rTfbFM-stA',
}
export const darkConfig = {
  map:{
    ...commonMap,
    style: 'zyzx://custom/hvcRzD636NIrG_Y3531qn.json',
    backgroundColor: '#214560',
  },
  layer: {
    proviceBgColor: 'rgba(26, 38, 55, 1)',
    provinceColor: '#03F0FF', // 省边界
    districtColor: '#00FFFF', // 市边界
    streetColor: '#608FD5', // 街道边界
    zoneRangeColor: '#15B1F4', // 管控圈
    lifeRangeColor: '#038C3A', // 生活圈
    sendRangeColor: '#B360F4', // 配送圈
    makerTextColor: '#1FC9FF', // maker文字颜色 
  }
}
export const lightConfig = {
  map:{
    ...commonMap,
    style: 'zyzx://custom/XbW0BFwvgmjQVAzGT2nzE.json', // zyzx://custom/Fqi20cXsy6-8-ZAn-AJD2.json
    backgroundColor:'#91C0E3'
  },
  layer: {
    proviceBgColor: 'rgba(243, 248, 255, 1)',
    provinceColor: '#2389FF', // 省边界
    districtColor: '#B360F4', // 市边界
    streetColor: '#4670AF', // 街道边界
    zoneRangeColor: '#0673A2', // 管控圈
    lifeRangeColor: '#038C3A', // 生活圈
    sendRangeColor: '#50038C', // 配送圈
    makerTextColor: '#003D9A', // maker文字颜色 
  }
}
export const typeImageList = {}