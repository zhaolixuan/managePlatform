export const getBreadMap = (routeConfig) => {
  const breadMap = {};
  const recusive = (menu, parents) => {
    menu
      .filter((i) => i.path || i.routes)
      .forEach((route) => {
        const { routes, path } = route;
        breadMap[path] = parents.concat(route);
        if (routes) recusive(routes, breadMap[path]);
      });
  };
  recusive(routeConfig, []);
  return breadMap;
};

// 通过现有的权限路由，产出menu菜单
export const getControlMenuData = (authRoutes) => {
  function removeDisable(menuData) {
    return menuData.reduce((pre, cur) => {
      /* eslint-disable @typescript-eslint/no-unused-vars */
      const {
        // menu 需要排除的属性 hideChildrenInMenu, hideInMenu, exact, component
        path,
        routes,
        hideChildrenInMenu,
        hideInMenu,
        exact,
        component,
        redirect,
        ...ext
      } = cur;
      // // 过滤禁用路由，或者隐藏路由
      // if (path && !paths.includes(path)) return pre;
      if (hideInMenu || !path || redirect) return pre;

      if (hideChildrenInMenu || !routes) {
        return pre.concat({ path, ...ext });
      }

      return pre.concat({ path, routes: removeDisable(routes), ...ext });
    }, []);
  }
  return removeDisable(authRoutes);
};
