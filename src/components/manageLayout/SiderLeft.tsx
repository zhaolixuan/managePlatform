import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Layout, IconFont } from '@jd/find-react';
import Menu from './Menu';
import styles from './SiderLeft.module.less';

const { Sider } = Layout;

@inject('manageLayout')
@observer
class SiderLeft extends Component<any, any> {
  constructor (props) {
    super(props);
    this.state = {
      collapsed: false,
    };
  }

  onCollapse = (curCollapsed) => {
    this.setState({ collapsed: curCollapsed });
  };

  get curPath() {
    return window.location.hash.substr(1);
  }

  render() {
    const { collapsed } = this.state;
    const {
      manageLayout: { sideMenuData },
    } = this.props;
    return (
      <Sider
        collapsible
        width='240'
        className={`${styles['menu-wrap']} ${!collapsed && styles['un-collapsed']}`}
        onCollapse={this.onCollapse}
        collapsed={collapsed}
        theme='dark'
        trigger={collapsed ? <IconFont type='iconMenuUnfoldout-Lined' /> : <IconFont type='iconMenuFoldout-Lined' />}
      >
        {sideMenuData.length ? <Menu menuData={sideMenuData} selected={this.curPath} collapsed={collapsed} /> : null}
      </Sider>
    );
  }
}

export default SiderLeft;
