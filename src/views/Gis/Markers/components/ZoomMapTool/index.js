import React from 'react';
import styles from './index.module.less';

const ZoomMapTool = ({ map, zoomToolConfig }) => {
  const { bottom = 0, right = 0 } = zoomToolConfig;
  const zoom = (operator) => {
    const curZoom = map.getZoom();
    if (operator === '+') {
      map.setZoom(curZoom + 0.5);
    } else {
      map.setZoom(curZoom - 0.5);
    }
  };
  return (
    <div className={styles.wrapper} style={{ bottom, right }}>
      <div className={styles.operator} onClick={() => zoom('+')}>
        +
      </div>
      <div className={styles.splitLine}></div>
      <div className={styles.operator} onClick={() => zoom('-')}>
        -
      </div>
    </div>
  );
};

export default ZoomMapTool;
