import React from 'react';
import styles from './index.module.less';
/**
 * 自定地图工具
 * @param {Number|String|Undefined}   right 右侧距离
 * @param {Number|String|Undefined}   bottom 底部距离
 * @param {Array}                     theme 主题
 * @param {Array}                     dimension 维度
 * @param {Function}                  changeTheme 改变主题方法
 * @param {Function}                  changeDimension 改变维度方法
 * @param {Function}                  changeZoom 改变缩放方法
 * @param {Function}                  showLegend 展示图例
 * @param {Function}                  easeTo     跳转到
 */
const ToolLayer = ({ right, bottom, dimension, changeDimension, changeTheme, changeZoom, showLegend, easeTo }) => {
  return (
    <div className={`${styles.toolWrapper} ${styles[`right${right}`]}`}style={{ bottom }}>
        <div className={styles.legendWrapper} onClick={()=> showLegend && showLegend()}><div className={styles.bg}></div></div>
        <div className={styles.themeWrapper} onClick={()=> changeTheme && changeTheme()}><div className={styles.bg}></div></div>
        <div className={styles.dimensionWrapper} onClick={()=> changeDimension && changeDimension()}><div className={`${styles[`dimension${dimension}`]}`}></div> </div>
        <div className={styles.originWrapper} onClick={()=>easeTo()}><div className={styles.bg}></div></div>
        <div className={styles.zoomWrapper}>
            <div className={styles.operator} onClick={() => changeZoom && changeZoom('+')}> + </div>
            <div className={styles.splitLine}></div>
            <div className={styles.operator} onClick={() => changeZoom && changeZoom('-')}> - </div>
        </div>
    </div>
  );
};

export default ToolLayer;
