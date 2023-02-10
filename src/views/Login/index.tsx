import React from 'react';
import { inject, observer } from 'mobx-react';
import Login from '@/components/Login';
import styles from './Login.module.less';

@inject('user')
@observer
class UserLogin extends React.Component<any, any> {
  render() {
    const {
      user: { setUserInfo },
    } = this.props;

    return (
      <div className={styles.login}>
        <div className={styles['user-container-bg']}>
          <Login afterLogin={setUserInfo}></Login>
        </div>
      </div>
    );
  }
}

export default UserLogin;
