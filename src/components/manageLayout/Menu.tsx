import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Menu } from '@jd/find-react';
import { getFlatMenu } from '@/router/constant';
import _ from 'lodash';
import qs from 'qs';
import styles from './Menu.module.less';
import { domains } from '@/config';
const { Item: MenuItem, SubMenu } = Menu;

interface Iprops {
  menuData: any;
  selected: any;
  collapsed?: boolean;
}
class MenuList extends Component<Iprops, any> {
  // eslint-disable-next-line react/sort-comp
  topKeys = [];

  constructor (props) {
    super(props);
    const { selected } = props;
    this.state = {
      defaultSelectedKeys: [selected],
      openKeys: this.getOpenKeys(),
      menus: [],
    };
  }

  componentDidMount() {
    const { menuData } = this.props;
    this.progressData(menuData);
    this.hashChangeHandle();
    window.addEventListener('hashchange', this.hashChangeHandle);
  }

  componentWillUnmount() {
    window.removeEventListener('hashchange', this.hashChangeHandle);
  }

  hashChangeHandle = () => {
    const hash = window.location.hash.replace(/[#]/, '');
    console.log(hash, 123, this.state.menus);
    const { menuData } = this.props;
    const path = getFlatMenu(menuData, 'routes').filter(item => hash === item.path || hash.includes(item.path));
    const selectPath = path[1]?.path || path[0]?.path;
    this.setState({
      defaultSelectedKeys: [selectPath],
    });
  };

  progressData = (menuData) => {
    this.topKeys = menuData.map((item) => item.path);
    this.setState({
      menus: this.getMenus(menuData),
    });
  };

  getOpenKeys = () => {
    const { menuData, selected } = this.props;
    const openKeys = [];
    const recusive = (list) => {
      const validRoute = list.find((i) => selected.indexOf(`${i.path}/`) === 0);
      if (!validRoute) return;
      const { path, routes } = validRoute;
      if (path === selected) return;
      openKeys.push(path);
      if (routes && routes.length > 0) recusive(routes);
    };
    recusive(menuData);
    return openKeys;
  };

  getMenuItem = ({ path, name, img, link,url, params }) => {
    const { selected } = this.props;
    const query = params ? `?${qs.stringify(params)}` : '';
    const realLink = link ? link() : `#${path}${query}`;
    const isActive = path === selected;
    const access_token = JSON.parse(localStorage.getItem('access_token')).v
    return (
      <MenuItem key={path} icon={this.renderImg(img, isActive)}>
        <a href={url ?? realLink} target={`${!url ? '_self' : '_blank'}`}>
          {/* <img src={}></img>  */}
          <span className={styles.title}>{name}</span>
        </a>
      </MenuItem>
    );
  };

  getMenus = (menus) =>
    menus.map((menu) => {
      const { path, name, img, routes: childrenRoutes } = menu;
      const { openKeys } = this.state;
      const isActive = path === openKeys[0];
      if (childrenRoutes?.length) {
        return (
          <SubMenu key={path} icon={this.renderImg(img, isActive)} title={<span>{name}</span>}>
            {this.getMenus(childrenRoutes)}
          </SubMenu>
        );
      }
      return this.getMenuItem({ ...menu });
    });

  onMenuOpenChg = (openKeys = []) => {
    const { collapsed } = this.props;
    if (collapsed) {
      return;
    }
    // openKeys
    const lastestOpenKey = _.last(openKeys);
    if (this.topKeys.indexOf(lastestOpenKey) === -1) {
      // 如果新加入的顶层没有，则说明是里面的子栏目，则全部展开。
      this.setState({ openKeys });
    } else {
      this.setState({
        // 如果新加入的顶层有，则只展开顶层的这个，其他的都关闭
        openKeys: lastestOpenKey ? [lastestOpenKey] : [],
      });
    }
  };

  renderImg = (img, isActive) => {
    if (img) {
      const { src, type = 'svg', iconName: IconControl } = img;
      const access_token =  JSON.parse(localStorage.getItem('access_token')).v 

      const fullImg = `${src}.${type}`;
      try {
        if (IconControl) {
          return IconControl;
        }
        if(img){
          return (
            <img
              className='menu-icon-img'
              alt=''
              src={`${process.env.REACT_APP_FILE_URL}${domains.tq_login}/appcenter/web/v2/icon/${img}?appCode=DRIGHT&jwtToken=${access_token.substring(8,access_token.length-1)}`}
            />
          );
        }
       
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  render() {
    const { openKeys, menus, defaultSelectedKeys } = this.state;
    console.log(menus, defaultSelectedKeys);
    
    // const { collapsed } = this.props;
    return (
      <div className={`${styles['menu-wrapper']}`}>
        <Menu
          className={styles.menu}
          mode='inline'
          theme='dark'
          openKeys={openKeys}
          onOpenChange={this.onMenuOpenChg}
          selectedKeys={defaultSelectedKeys}
          // inlineCollapsed={collapsed}
        >
          {menus}
        </Menu>
      </div>
    );
  }
}

export default withRouter(MenuList);
