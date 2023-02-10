import React from 'react';
import styles from '../Enclosure.module.less';

function Total(props) {
  const { data: { plotCount, dayPercentum, weekPercentum }} = props;
  console.log(plotCount, dayPercentum, weekPercentum,'1111111');
  return (
    <div className={`${styles.block} ${styles.boxShadow}`}>
      <div className={styles.blockTitle}>高风险区数量</div>
      <div className={styles.blockContent}>
        <div className={styles.total}>
          <div className={styles.totalNum}>{plotCount || 0}</div>个
        </div>
        <div className={styles.circle}>
          <div className={styles.dayCircle}>
            <div className={styles.name}>日环比</div>
            <div className={styles.num}>{dayPercentum || '0.00'}%</div>
            <div className={dayPercentum >=0 ? styles.iconUp : styles.iconDown}></div>
          </div>
          <div className={styles.weekCircle}>
            <div className={styles.name}>周环比</div>
            <div className={styles.num}>{weekPercentum || '0.00'}%</div>
            <div className={weekPercentum >=0 ? styles.iconUp : styles.iconDown}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Total;
