/* eslint-disable */
import React from 'react';
import styles from './index.module.less';

const CheckboxMapTool = ({map,checkboxToolConfig = {},checkboxStatus,setCheckboxStatus,theme}) => {
  const {bottom = '171px', right = '403px'} = checkboxToolConfig;
  const changeCheckboxStatus = () => {
    setCheckboxStatus(!checkboxStatus)
  }
  return (
    <div className={styles['checkbox-map-icon']} onClick={changeCheckboxStatus} style={{ bottom, right }}>
      <img src={require(`../../assets/${theme}/checkbox-map-icon.png`)} alt='icon' />
    </div>
  );
};

export default CheckboxMapTool;