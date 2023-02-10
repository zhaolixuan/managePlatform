import { times } from "lodash";

export const PATHS = {
  LOGIN: '/user/login',
  DASHBOARD: '/manage/control/data',
  SITE: '/gis/site',
  ENCLOSURE: '/gis/enclosure',
};

export const filterRouter = (currentData, targetData) => {
  const routerList = [];
  if (!currentData || !targetData) return [];
  currentData.forEach(item => targetData.forEach(d => d.path === item.code && routerList.push(d)));
  return routerList;
}

// 扁平化菜单
export const getFlatMenu = (allRoutes, childKeyName = 'children') => {
  if (!allRoutes) return []
  function recursive(menuData) {
    return menuData.reduce((pre, cur) => {
      const childRoutes = cur[childKeyName];

      if ((!childRoutes) || (!childRoutes.length)) return pre.concat(cur); // 没有子路由，直接拼起来

      return pre.concat([cur, ...recursive(childRoutes)]); // 有子路由，继续往里面遍历
    }, []);
  }
  return recursive(allRoutes);
};

// 过滤后台管理菜单
/**
 * 
 * @param {Object} data 项目中的菜单配置信息 
 * @param {Object} targetData  扁平化后天权中的菜单配置信息
 * @param {*} originTianquanData  未扁平化、原本的天权菜单配置信息
 * @returns 
 */
export const filterManageRouter = (data, targetData) =>{
  if (!data || !targetData) return []
  const aimMenuData =  targetData.map((item) => {
    const hasRouter = data.find(i => i.code === item.code);
    if (hasRouter) {
      return {
        ...hasRouter,
        ...item,
        img: hasRouter.icon || item.icon,
        routes: item.children ? filterManageRouter(data, item.children).filter(Boolean) : null,
      }
    }
     else if (!hasRouter && item?.type !== 3) {
      return {
        ...item,
        path: '/manage/404',
        img: item.icon,
        component: () => import('@/components/Error'),
        routes: item.children ? filterManageRouter(data, item.children).filter(Boolean) : null,
      }
    }
  }).filter(Boolean)
  return aimMenuData;
}

