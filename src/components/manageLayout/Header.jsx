import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Menu, Dropdown, IconFont, Layout } from '@jd/find-react';
import { observer, inject } from 'mobx-react';
import { PATHS } from '@/router/constant';
import styles from './Header.module.less';

const { Header } = Layout;

const { Item: MenuItem } = Menu;
// interface Iprops {
//   history: any;
//   user: any;
//   manageLayout: any;
// }

@inject('user', 'manageLayout')
@observer
class HeaderTop extends Component {
// class HeaderTop extends Component<Iprops, any> {
  get personMenu() {
    const {
      history,
      user: { logout },
      manageLayout: { setSideMenuData },
    } = this.props;

    return (
      <Menu
        className={styles.menuPerson}
        onClick={({ key: path }) => {
          if (path === '/user/login') {
            logout();
            setSideMenuData([]); // 清空侧边导航,因为menu有判断menudata.lenth > 0就不重新创建sideMenuData
            return;
          }
          history.push(path);
        }}
        selectedKeys={[]}
      >
        <MenuItem key='/user/login'>退出</MenuItem>
      </Menu>
    );
  }

  render() {
    const { personMenu } = this;
    const {
      user: { userInfo },
    } = this.props;
    return (
      <Header size='small' >
        <div className={styles['header-logo']}>
          <div className={styles.logo}>
            <img src={require('@/assets/manage/logo.png')} alt=''  width='32px' height='32px' />
          </div>
          <div className={styles.title}>
            <Link to={PATHS.DASHBOARD}>北京市生活必需品应急保供调度平台管理后台</Link>
          </div>
        </div>
        <div className={styles['header-user']}>
          <Dropdown overlay={personMenu}>
            <span>
              <IconFont type='iconuserCircle-Filled' />
              {userInfo.userName}
            </span>
          </Dropdown>
        </div>
      </Header>
    );
  }
}

export default withRouter(HeaderTop);
