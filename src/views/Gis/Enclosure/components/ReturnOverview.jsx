import React from 'react';
import styles from '../Enclosure.module.less';

function ReturnOverview ({ text = '返回总览', onClickBack = () => {} }) {
  return <div className={styles.tabs_plan} onClick={onClickBack}>
    <div className={styles.tabs_plan_content}>
      <span className={styles.back}>←</span>
      {
        text
      }
    </div>
  </div>;
}

export default ReturnOverview