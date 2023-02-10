import { memo,useEffect } from 'react';
import Player from '../Player';
import EllipsisSpan from '../EllipsisSpan';
import styles from './popupComplex.module.less';

const PopupComplex = memo(
  ({ title, columns, detail, theme, onPopupClose }) => {
    const { videoUrl } = detail;
    const closePopup = () => {
      onPopupClose && onPopupClose()
      document
        .getElementsByClassName('mapboxgl-popup-close-button')[1]
        .dispatchEvent(new MouseEvent('click', { bubbles: true }));
    };
    useEffect(()=>{
      // 将原生的x隐藏掉
      document
        .getElementsByClassName('mapboxgl-popup-close-button')[1].style.display = 'none';
    },[])
    return (
      <div className={styles['popup-content']}>
        <div className={styles['header-area']}>
          <img src={require('@/assets/images/head-decorator.png')} className={styles['head-decorator']} alt='icon' />
          <div className={styles.header}>{title}</div>
          <button
            className={`mapboxgl-popup-close-button ${styles['close-button']}`}
            type='button'
            aria-label='Close popup'
            onClick={closePopup}
            id='close-button'
            // style={{ marginTop: videoUrl && videoUrl !== 'null' ? '122px' : '59px', marginRight: '15px' , color:'#fff', fontSize:'30px'}}
          >
            ×
          </button>
        </div>
        {videoUrl && videoUrl !== 'null' && <Player url={videoUrl} />}
        <div className={styles['content-area']}>
          <div className={styles['content-wrapper']}>
            {columns.map((el, idx) => {
              return (
                <div className={styles['item-wrapper']} key={`${idx}${el.code}`}>
                  <div className={styles['detail-name']}>{el.label}</div>
                  <div className={styles['split-line']}>|</div>
                  <div className={styles['detail-value']}>
                    {!detail[el.code] || detail[el.code] === 'null' || detail[el.code] === 'undefined' ? (
                      '-'
                    ) : (
                      <EllipsisSpan title={`${detail[el.code]}`} limit={12} />
                    )}
                    {el.unit}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  },
  (preProps, nextProps) => {
    return JSON.stringify(preProps.detail) === JSON.stringify(nextProps.detail);
  },
);
export default PopupComplex;
