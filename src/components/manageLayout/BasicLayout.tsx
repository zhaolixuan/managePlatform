import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Layout } from '@jd/find-react';
import { Routes } from '@/router';
import { manageRoutes as controlRoutes } from '@/router/configParts';
import { getControlMenuData } from '@/router/menu';
import withAuth from '../layout/withAuth';
import Bread from './Bread';
import SiderLeft from './SiderLeft';
import Header from './Header';
import styles from './BasicLayout.module.less';

const { Content } = Layout;

@inject('manageLayout')
@observer
class BasicLayout extends Component<any, any> {
  constructor (props) {
    super(props);
    this.state = {
      routes: [],
      iframeFlag:false
    };
  }
   
  

  componentDidMount() {
    this.updateAuthRoutesAndMenu();
    const {location:{pathname,search}}= this.props
     if(pathname === '/manage/dataview/list' && search.slice(1).indexOf('iframe=true') !== -1){
       this.setState({
        iframeFlag:true
       })
     }else{
      this.setState({
        iframeFlag:false
       })
     }
  }

  getControlRoutes = () => {
    function recursive(routerData) {
      return routerData.reduce((pre, cur) => {
        const { hideChildrenInMenu, path, routes, hideInMenu } = cur;
        if (!path || hideInMenu) return pre.concat(cur);
        if (hideChildrenInMenu || !routes) return pre.concat(cur);
        return pre.concat({ ...cur, routes: recursive(cur.routes) });
      }, []);
    }
    return recursive(controlRoutes);
  };

  updateAuthRoutesAndMenu = () => {
    const {
      manageLayout: { setSideMenuData, setBreadMap },
    } = this.props;
    const routes = this.getControlRoutes();
    const sideMenuData = getControlMenuData(routes);
    setSideMenuData(sideMenuData);
    setBreadMap(routes);
    this.setState({ routes });
  };

  render() {
    const {
      manageLayout: { breadMap },
    } = this.props;
    const {iframeFlag} = this.state
    
    return (
      <Layout className={styles.layout}>
       {!iframeFlag && < Header />} 
        <Layout className={styles['layout-container']}>
        {!iframeFlag && <SiderLeft />}  
          <Content className={styles['layout-content']}>
            {!iframeFlag && <Bread breadMap={breadMap} />}
            <div className={styles['layout-content-body']}>
              <div className={styles['layout-content-mid']}>
                <Routes routes={controlRoutes} />
              </div>
            </div>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default withAuth(BasicLayout);
