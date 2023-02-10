/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import styles from './index.module.less';

const DimensionTool = ({ dimensionToolConfig, map }) => {
  const { right, bottom } = dimensionToolConfig;
  const [dimension, setDimension] = useState('2D');
  const changeDimension = () => {
    if (dimension === '2D') {
      setDimension('3D');
      map.resetNorthPitch({ pitch: 60, duration: 1000 });
    } else {
      setDimension('2D');
      map.resetNorthPitch({ pitch: 0, duration: 2500 });
    }
  };
  return (
    <div className={styles.wrapper} onClick={changeDimension} style={{ right, bottom }}>
      {dimension}
    </div>
  );
};

export default DimensionTool;
