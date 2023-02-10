import React from 'react';
import { Button } from '@jd/find-react';
import ErrorImg from '@/assets/images/error-404.png';
import styles from './index.module.less';

const Error = React.memo(({ back = true, history }: any) => (
  <div className={styles['error-wrap']}>
    <img src={ErrorImg} alt='' />
    <div>
      <p className={styles['error-code']}>405</p>
      <p className={styles['error-info']}>抱歉，你没有权限，请联系管理员开通权限！</p>
      {back && (
        <Button
          type='primary'
          onClick={() => {
            history.push(JSON.parse(sessionStorage.getItem('manageMenus'))?.children[0]?.children[0]?.frontendUrl)
          }}
        >
          返回
        </Button>
      )}
    </div>
  </div>
));
Error.displayName = 'error-404';

export default Error;
