import { memo, useEffect, useState } from 'react';
import { Spin, Image } from '@jd/find-react';
import EllipsisSpan from '../EllipsisSpan';
import { toJS } from 'mobx';
import moment from 'moment';
import ShowMoreModal from './showMoreModal';
import styles from './index.module.less';

const PopupSimple = memo(
  ({ title, columns, detail, theme, onPopupClose }) => {
    let newColumns = [...columns];
    if(detail?.storesState && !detail?.storesState.includes('闭店')){
      // newColumns.splice(columns.length-2,2)
      // 这种方法比上行代码兼容性更好
      newColumns = columns.filter(i=> (i.label !== '闭店时间' && i.label !== '闭店原因'))
    }
    // 查看更多
    const [visible, setVisible] = useState(false);
    const [isshowMore, setShowMore] = useState(false);
    // site页面的图片是单独请求接口拿到的url，其他页面的图片链接为pictureDetails
    const { popupType, businessType, pictureDetails, url, id, businessName, enteringTime } = detail;
    const context = require.context('@/assets/images', true, /.png$/);
    const wrongImg = context(`./${theme}/wrong-img.png`);
    const closePopup = () => {
      onPopupClose && onPopupClose()
      document
        .getElementsByClassName('mapboxgl-popup-close-button')[1]
        .dispatchEvent(new MouseEvent('click', { bubbles: true }));
    };

    // 由于图片弹框层级不够需要进行提升
    const handlePreviewImg = () => {
      let domWrap, domMask;
      setTimeout(() => {
        domWrap = document.getElementsByClassName('ant-image-preview-wrap');
        // 点击多张图片后会创建多个dom
        for (let i = 0; i < domWrap.length; i++) {
          domWrap[i].style.zIndex = 10000000;
        }
        domMask = document.getElementsByClassName('ant-image-preview-mask');
        for (let i = 0; i < domMask.length; i++) {
            domMask[i].style.zIndex = 9999999;
          }
      }, 200);
    };

    // 超市门店点击更多
    const showMore = () =>  {
      console.log(toJS(detail),'======');
      if(detail.businessType === 7){
        setShowMore(true)
        setVisible(true)
      }else{
        detail?.showMore && detail.showMore()
      }
    }


    useEffect(() => {
      // 将原生的x隐藏掉
      document.getElementsByClassName('mapboxgl-popup-close-button')[1].style.display = 'none';
    }, []);
    return (
      <div className={styles['popup-wrapper']}>
        <div className={styles['header-area']}>
          <div className={styles.header}>{title}</div>
          <div
            className={
              popupType === 5 || popupType === 9 || popupType === 11 || businessType === 5
                ? styles['not-show-more']
                : styles['show-more']
            }
            onClick={showMore}
          >
            更多
          </div>
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
        <div className={styles['content-area']}>
          {popupType === 1 && (
            <div className={styles['img-wrapper']} originImg={url || pictureDetails}>
              {url || pictureDetails ? (
                <Image src={url || pictureDetails} fallback={wrongImg} onClick={handlePreviewImg} />
              ) : (
                <Image src={wrongImg} onClick={handlePreviewImg} />
              )}
            </div>
          )}
          {(popupType === 5 || popupType === 9 || popupType === 10) && (
            <div style={{ height: '15px', width: '100%' }}></div>
          )}
          <div className={styles['content-wrapper']}>
            {newColumns.map((el, idx) => {
              return (
                <div className={styles['item-wrapper']} key={`${idx}${el.code}`}>
                  <div className={styles['detail-name']}>{el.label}</div>
                  <div className={styles['split-line']}>|</div>
                  <div className={styles['detail-value']}>
                    {!detail[el.code] && el.code === 'recoveryTime' ? '待通知' : detail[el.code] && el.code === 'recoveryTime' && detail[el.code] === '待通知' ? detail[el.code] : !detail[el.code] || detail[el.code] === 'null' || detail[el.code] === 'undefined' ? (
                      '-'
                    ) : (
                        el.code === 'enteringTime' || el.code === 'closeDate' || el.code === 'recoveryTime'? (<EllipsisSpan title={`${moment(detail[el.code]).format('YYYY-MM-DD')}`} limit={12} />) 
                        :
                        (<EllipsisSpan title={`${detail[el.code]}`} limit={12} />)
                    )}
                    {el.unit}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <ShowMoreModal visible={visible} businessId={id} businessType={businessType} reportDate={(enteringTime !== null && enteringTime !== 'null' )?moment(enteringTime).format('YYYY-MM-DD'):''} name={businessName} setVisible={setVisible} showMore={isshowMore}/>
      </div>
    );
  },
  (preProps, nextProps) => {
    return JSON.stringify(preProps.detail) === JSON.stringify(nextProps.detail);
  },
);
export default PopupSimple;
