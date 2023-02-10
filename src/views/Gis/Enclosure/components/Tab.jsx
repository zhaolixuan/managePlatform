import { useEffect, useState } from 'react';
import styles from '../Enclosure.module.less';

/**
 *
 * @param {boolean} showControl 是否显示管控圈，有面数据才显示
 * @returns
 */
function Tab({ liveType, showControl = false, handleSelect }) {
  const [curr, setCurr] = useState(1);

  const onClick = (type) => {
    if (handleSelect) {
      handleSelect(type);
    }
    setCurr(type);
  };
  // const onClose = () => {
  //   if (handleSelect) {
  //     handleClose();
  //   }
  // };
  useEffect(() => {
    liveType && setCurr(liveType);
  }, [liveType]);

  return (
    <div className={styles.header}>
      {showControl && (
        <div className={`${styles.btn} ${showControl ? styles.fen_ge2 : styles.fen_ge} ${curr === 3 ? styles.active : ''}`}>
          <div className={`${styles.control}`} onClick={() => onClick(3)}>
            <div className={styles.com_div_style}>
              <span className={` ${styles.iconstyle} ${curr === 3 ? styles.bgnormalCA : styles.bgnormalC}`}></span>
              管控圈
            </div>
          </div>
        </div>
      )}
      <div className={`${styles.btn} ${showControl ? styles.fen_ge2 : styles.fen_ge} ${curr === 1 ? styles.active : ''}`}>
        <div className={`${styles.life}`} onClick={() => onClick(1)}>
          <div className={styles.com_div_style}>
            <span className={` ${styles.iconstyle} ${curr === 1 ? styles.bgnormalLA : styles.bgnormalL}`}></span>
            生活圈
          </div>
        </div>
      </div>
      <div className={styles.borderS}></div>
      <div className={`${styles.btn} ${curr === 2 ? styles.active : ''}`}>
        <div className={`${styles.send}`} onClick={() => onClick(2)}>
          <div className={styles.com_div_style}>
            <span className={` ${styles.iconstyle}  ${curr === 2 ? styles.bgnormalSA : styles.bgnormalS}`}></span>
            配送圈
          </div>
        </div>
      </div>
      {/* <div className={styles.close} onClick={() => onClose()}>
        x
      </div> */}
    </div>
  );
}
export default Tab;
