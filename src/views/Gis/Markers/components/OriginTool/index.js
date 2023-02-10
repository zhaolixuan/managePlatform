/* eslint-disable import/no-dynamic-require */
/* eslint-disable @typescript-eslint/no-require-imports */
import React from 'react';
import styles from './index.module.less';

const OriginTool = ({ map, originToolConfig, theme }) => {
  const { bottom = '', right = '' } = originToolConfig;

  const backToOrigin = () => {
    map && map.easeTo({ center: [116.38, 39.9] });
  };

  return (
    <div className={styles['back-origin-icon']} onClick={backToOrigin} style={{ bottom, right }}>
      <img src={require(`../../assets/${theme}/backTo-origin.png`)} alt='icon' />
    </div>
  );
};

export default OriginTool;
