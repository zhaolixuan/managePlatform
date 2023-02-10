export default [
  {
    path: '/gis',
    name: '能力地图首页',
    img: { src: 'icon_data_analysis' },
    exact: true,
    component: () => import('@/views/Gis'),
    routes: [
      {
        path: '/gis/detail',
        name: '测试页面',
        exact: true,
        component: () => import('@/views/Gis/Detail'),
      },
      {
        path: '/gis/markers',
        name: '门店、人员、车辆',
        exact: true,
        component: () => import('@/views/Gis/Markers'),
      },
      {
        path: '/gis/site',
        name: '场所',
        exact: true,
        component: () => import('@/views/Gis/Site'),
      },
      {
        path: '/gis/carIn',
        name: '京内车辆',
        exact: true,
        component: () => import('@/views/Gis/CarIn'),
      },
      {
        path: '/gis/carOut',
        name: '京外车辆',
        exact: true,
        component: () => import('@/views/Gis/CarOut'),
      },
      {
        path: '/gis/user',
        name: '人员',
        exact: true,
        component: () => import('@/views/Gis/User'),
      },
      {
        path: '/gis/enclosure',
        name: '防疫',
        exact: true,
        component: () => import('@/views/Gis/Enclosure'),
      },
      {
        path: '/gis/testMap',
        name: '测试地图',
        exact: true,
        component: () => import('@/views/Gis/TestMap'),
      },
      {
        path: '/gis/solution',
        name: '保供方案',
        exact: true,
        component: () => import('@/views/Gis/Solution'),
      },
    ],
  },
];
