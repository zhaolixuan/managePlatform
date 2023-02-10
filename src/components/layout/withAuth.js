/* eslint-disable no-unused-vars */
import React from 'react';
import { withRouter } from 'react-router-dom'
import qs from 'qs';
import { inject, observer } from 'mobx-react';
import loginAdapter from '../Login/loginAdapter';
import pluginConfig from '../Login/login.config';
import { verify, menus } from '@/api/user';


function withAuth(RenderComponent) {
  @inject('user', 'layout', 'gis')
  @observer
  class Auth extends React.Component {

    componentDidMount() {
      this.authCheck();
    }

    async authCheck() {
      const { location, user: { setUserInfo }, layout: { update, menuAllData }, gis: { setCurRegion } } = this.props;
      try {
        if (sessionStorage.getItem('access_token') && localStorage.getItem('access_token')) {

          // 获取用户信息
          const res = await verify();

          // 获取GIS菜单
          const gsiMenus = await menus({
            appCode: 'gis-map',
            userId: res?.data?.user_info?.id
          });

          // 获取后台管理菜单
          const manageMenus = await menus({
            appCode: 'gis-manage',
            userId: res?.data?.user_info?.id
          });

          // 更新GIS头部菜单
          update({
            menuData: menuAllData.filter(item => {
              const titles = gsiMenus.data.children.map(i => i.name);
              return titles.includes(item.title) || item.title === '联系我们'
            })
          })
          
          if (window.location.hash.indexOf('/manage/dataview/list?iframe=true') === -1 && window.location.hash.includes('manage') && sessionStorage.getItem('isLogin') !== 'true') {
            this.props.history.push(manageMenus?.data?.children[0]?.children[0]?.frontendUrl)
            sessionStorage.setItem("isLogin", 'true');
          }

          // if (window.location.hash.includes('manage')) {
          //   this.props.history.push(manageMenus?.data?.children[0]?.children[0]?.frontendUrl)
          // }

          sessionStorage.setItem('refresh_token', res.data.refresh_token);
          sessionStorage.setItem('token', res.data.access_token);
          sessionStorage.setItem('user_info', JSON.stringify(res.data.user_info));
          sessionStorage.setItem('gsiMenus', JSON.stringify(gsiMenus.data));
          setUserInfo(res.data.user_info);

          const user = await loginAdapter.get(pluginConfig.loginValidate)
          sessionStorage.setItem('loginInfo', JSON.stringify(user.area === '天权平台' || user.area === '北京市' ? { ...user, area: '' } : user));
          // // @ts-ignore
          sessionStorage.setItem('area', user.area === '天权平台' || user.area === '北京市' || user.area === '全国' ? '' : user.area);
          setCurRegion(user.area === '天权平台' || user.area === '北京市' || user.area === '全国' ? '' : user.area)
          setUserInfo(user);
          return;
        }
        if (!sessionStorage.getItem('access_token')) {
          window.location.href = `${process.env.REACT_APP_LOGIN_URL}/#/login?tenantName=领导驾驶舱&returnUrl=${window.location.href}`;
        }
      } catch (error) {
        console.log(error);
      }

    }

    render() {
      // const loginInfo = sessionStorage.getItem('token');
      return <RenderComponent {...this.props} />;
      // !loginInfo ? (
      //   <Spin spinning size='large' tip='加载中，请稍后...'>
      //     <div style={{ height: 'calc(100vh)' }}></div>
      //   </Spin>
      // ) : (
      //   <RenderComponent {...this.props} />
      // );
    }
  }

  return Auth;
}

export default withAuth;
