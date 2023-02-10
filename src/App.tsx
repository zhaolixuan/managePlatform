import React, { useEffect, useState } from 'react';
import { ConfigProvider, message } from '@jd/find-react';
import 'moment/locale/zh-cn';
import zhCN from '@jd/find-react/es/locale/zh_CN';
import { HashRouter } from 'react-router-dom';
import dayjs from 'dayjs';
import { Routes } from '@/router';
// import { layoutRoutes } from '@/router/configParts';
// eslint-disable-next-line camelcase
import { SHOWMORE_ENCRY, asscess_token } from '@/config';
import { verify, menus } from '@/api/user';
import * as api from '@/api/gisOther';
import './utils/EventBus';
import 'dayjs/locale/zh-cn';
import './styles/theme/dark/index.css';
import './styles/theme/light/index.css';

dayjs.locale('zh-cn');
message.config({
  maxCount: 1,
});

const App = () => {
  // eslint-disable-next-line no-unused-vars
  const [forceUpdate, setForceUpdat] = useState(0)
  const [layoutRoutes, setLayoutRoutes] = useState([]);
  const getRoutes = async () => {
    // 获取用户信息
    const res = await verify();

    // 获取GIS菜单
    const gsiMenus = await menus({
      appCode: 'gis-map',
      userId: res?.data?.user_info?.id
    });

    // 更新GIS头部菜单
    // update({ menuData: menuAllData.filter(item => gsiMenus.data.children.map(i => i.name).includes(item.title) || item.title === '联系我们') })

    // 获取后台管理菜单
    const manageMenus = await menus({
      appCode: 'gis-manage',
      userId: res?.data?.user_info?.id
    });
  
    if(res?.data){
      sessionStorage.setItem('refresh_token', res.data.refresh_token);
      sessionStorage.setItem('token', res.data.access_token);
      sessionStorage.setItem('user_info', JSON.stringify(res.data.user_info));
      sessionStorage.setItem('gsiMenus', JSON.stringify(gsiMenus.data));
      sessionStorage.setItem('manageMenus', JSON.stringify(manageMenus.data));
    }
  }

  const test = async () => {
    if (localStorage.getItem('access_token')) {
      sessionStorage.setItem('access_token', localStorage.getItem('access_token'));
      setTimeout(async () => { 
        await getRoutes()
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        setLayoutRoutes(require('@/router/configParts').layoutRoutes)
      }, 50);
    }
  }
  test();
  // process.env.REACT_APP_BUILD_ENV === 'development' && localStorage.setItem('access_token', JSON.stringify(asscess_token)); // 开发环境调试用，忽略

  useEffect(() => {
    try {
      // 处理gis地图popup中的更多的点击事件
      api.getToken(SHOWMORE_ENCRY).then(({ data }) => {
        data && localStorage.setItem('showMoreToken', data);
      });
    } catch (error) {
      // message.error(error.message);
    }
  }, []);
  if (!layoutRoutes.length) return null;

  return (
    // @ts-ignore
    <HashRouter>
      <ConfigProvider locale={zhCN}>
        <Routes routes={layoutRoutes} />
      </ConfigProvider>
    </HashRouter>
  );
};

export default App;
