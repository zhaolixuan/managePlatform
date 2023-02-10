/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { observer, inject } from 'mobx-react';
import { Menu, Dropdown, IconFont, Modal } from '@jd/find-react';
import { useRouter, useStore } from '@/hooks'; // 业务中，和路由相关的使用此hooks
import { toJS } from 'mobx';
import styles from './Header.module.less';

const { Item: MenuItem } = Menu;

function HeaderTop({ layout, user }) {
  const { addLogRecord }
  = useStore('logManagement');
  const { menuData } = layout;
  console.log(toJS(menuData),'menuData')
  const [visible, setVisible] = useState(false);
  const [menuDataAuth, setMenuDataAuth] = useState(menuData)

  const { push, pathname } = useRouter();
  const { userInfo, logout } = user;

  const goTo = (code,CODE) => () => {
    addLogRecord({
      code: CODE
    })
    console.log(CODE);
    // 联系我们
    if (code === 'contact') {
      setVisible(true);
      return;
    }
    // console.log(JSON.parse(sessionStorage.getItem('manageMenus'))?.children[0]?.children[0]?.frontendUrl);
    // 跳转到列表数据
    push({
      // path: code === 'manage' ? `/${code}/control/data` : `/gis/${code}`,
      path: code === 'manage' ? JSON.parse(sessionStorage.getItem('manageMenus'))?.children[0]?.children[0]?.frontendUrl : `/gis/${code}`,
      query: {},
    });
  };

  const personMenu = () => <Menu
    style={{ zIndex: 5555 }}
    onClick={({ key: path }) => {
      if (path === '/user/login') {
        logout();
        return;
      }
      push({
        path,
        query: {},
      });
    }}
    selectedKeys={[]}
  >
    <MenuItem key='/user/login'>退出</MenuItem>
  </Menu>;

  useEffect(() => {
    if (!menuData) return;
    const menuList = menuData.filter(({ code }) => {
      return userInfo.userName === 'beijing' || userInfo.userName === 'admin' || code !== 'manage';
    });
    setMenuDataAuth(menuList);
  }, [menuData])

  return (
    <div className={styles.headerWrap}>
      <div className={styles['header-logo']}>
      </div>
      <div className={styles['header-menu']}>
      </div>
      <div className={styles['header-right']}>
        <div className={styles['header-user']}>
          <Dropdown overlay={personMenu} overlayStyle={{ zIndex: 5555 }}>
            <span>
              <IconFont type='iconuserCircle-Filled' />
              {userInfo.userName}
            </span>
          </Dropdown>
        </div>
      </div>
      <div className={styles.wordWarp}>
        <div className={styles.titleDiv}>
          北京市生活必需品应急保供调度平台
        </div>
        <div className={styles.menuDiv}>
          {menuData.map(({ title, code, CODE }) => (
            <div
              className={`${styles.menu} ${ (code === 'contact' && visible==true) || (visible==false && code === pathname?.split('/')[2]) ? styles.active : ''}`}
              key={code}
              onClick={goTo(code,CODE)}
            >
              {code == "enclosure" ? '风险区保供' : title}
            </div>
          ))}
        </div>
      </div>

      <Modal
        // title='联系我们'
        visible={visible}
        zIndex={10000001}
        centered
        width='28%'
        bodyStyle={{
          height: '11%',
          padding: 0,
          margin: 0,
          borderRadius: '4px 4px 0 0',
          overflow: 'hidden'
        }}
        footer={null}
        sticky
        closable={false}
        onCancel={() => {
          setVisible(false);
        }}
      >
        <div className={styles.tabs_top}>
          <img src={require('@/assets/images/solution_title_icon.png')} alt='' />
          <img onClick={() => setVisible(false)} src={require('@/assets/images/clos_icon_night.png')} alt='' />
        </div>
        <div className={styles['header-contact']}>
          感谢您的信任，请在京办中联系兰硕鹏（13810825793）反馈问题或建议，我们将尽快回复您的消息。
        </div>
      </Modal>
    </div>
  );
}

export default inject('layout', 'user')(observer(HeaderTop));
