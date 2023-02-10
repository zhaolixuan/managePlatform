// import { PATHS } from '@/router/constant';
import { filterRouter, getFlatMenu, filterManageRouter } from '../constant'
import manage from './manage';
import gis from './gis';

const gisMenus = JSON.parse(sessionStorage.getItem('gsiMenus')) || {};
const manageMenus = JSON.parse(sessionStorage.getItem('manageMenus')) || {};

// 第一层路由： 控制布局的
export const layoutRoutes = [
  // {
  //   path: PATHS.LOGIN,
  //   component: () => import('@/views/Login'),
  // },
  {
    path: '/gis', // 需要验证登录 才可以查看的 控制台 页面
    component: () => import('@/components/layout/BasicLayout'),
  },
  {
    path: '/manage', // 需要验证登录 才可以查看的 控制台 页面
    component: () => import('@/components/manageLayout/BasicLayout'),
  },
  {
    path: '/',
    exact: true,
    redirect: '/gis/site'
    // redirect: filterRouter(gisMenus?.children, gis[0].routes)[0]?.path || '/404',
  },
  {
    path: '*',
    component: () => import('@/components/Error'),
  },
];
// console.log(filterRouter(gisMenus?.children, gis[0].routes)[0].path);
// 第二层路由： 布局中的路由
// 1.BasicLayout中的路由(gis地图路由)
export const controlRoutes = [
  // ...gis, 
  ...filterRouter(gisMenus?.children, gis[0].routes),
  {
    path: '*',
    component: () => import('@/components/Error'),
  },
];

console.log(filterManageRouter( getFlatMenu(manage, 'routes'), manageMenus?.children), 1234321);

// 第二层路由： 布局中的路由
// 1.BasicLayout中的路由(后台/控制台路由)
export const manageRoutes = [
  // ...getFlatMenu(manage, 'routes').filter(item => getFlatMenu(manageMenus?.children).includes(item.name)),
  // TODO  提交代码前打开
  // ...filterManageRouter(manage, getFlatMenu(manageMenus?.children),manageMenus?.children),
  ...filterManageRouter( getFlatMenu(manage, 'routes'), manageMenus?.children),
  // ...manage,
  {
    path: '/manage/404',
    hideInMenu: true,
    component: () => import('@/components/Error1'),
  },
  {
    path: '/manage',
    redirect: '/manage', // 自动跳转到测试页面
    // redirect: filterManageRouter(manage, getFlatMenu(manageMenus?.children))[0]?.path || '/404', // 自动跳转到测试页面
  },
   {
    path: '*',
    hideInMenu: true,
    component: () => import('@/components/Error'),
  },
];
