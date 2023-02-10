// 预发环境
console.log('预发环境')
window.GLOBAL_CONFIG = {
  // 接口前缀
  baseURL: 'https://bxp.sw.beijing.gov.cn/report-api-uat',
  ossUrl: 'https://s3.cn-north-1.jdcloud-oss.com',
  outURL: 'https://bxp.sw.beijing.gov.cn',
  outOaURL: 'https://bxp.sw.beijing.gov.cn',
  // outOaURL: 'https://jzb-pre.jdcloud.com',
  fileBaseUrl: 'https://bxp.sw.beijing.gov.cn',
  baseMapUrl:'https://bxp.sw.beijing.gov.cn',
  baseMapApi: 'https://bxp.sw.beijing.gov.cn/report-api-uat', // 查询经信局地图poi接口
};
