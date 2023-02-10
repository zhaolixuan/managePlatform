/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable import/no-dynamic-require */
import React, { useState, useEffect } from 'react';
import { Tooltip } from '@jd/find-react';
import Card from '@/components/Card';
import Ellipsis from '@/views/Gis/Markers/components/EllipsisSpan';
import styles from './imageTab.module.less';
import { useStore } from '@/hooks';

/**
 *
 * @param {Boolean} props.hasHead 是否显示tab头部
 * @param {String} props.tabTitle tab头部的文字
 * @param {Boolean} props.hasTextImage 第一张图片是否为文字图片
 * @param {String} props.imageTitle 第一张图片的文字
 * @param {Array} props.imageList 图片列表
 * @param {Function} props.switchImage 切换图片触发事件
 * @returns 图片tab
 */
function ImageTab(props) {
  const {
    option: { hasHead = false, hasTextImage = false, tabTitle = '', imageTitle = '', imageList },
  } = props;
  const [imageId, setImageId] = useState();
  const { showTracksTable } = useStore('gis');
  const switchImageFunc = (item) => {
    const { switchImage } = props;
    setImageId(item.id === imageId ? undefined : item.id);
    switchImage && switchImage(item.id === imageId ? undefined : item);
  };

  useEffect(() => {
    if (!showTracksTable) {
      setImageId(undefined);
    }
  }, [showTracksTable]);

  return (
    <div className={styles.imageTab}>
        <Card title={tabTitle} hasHead={hasHead}>
          {/* {hasHead ? (
            <div className={styles.imageTabHead}>
              <div className={styles.imageTabTitle}>{tabTitle}</div>
            </div>
          ) : null} */}
          <div className={styles.content}>
            <div className={styles.imageTabContent}>
              {hasTextImage ? (
                <div className={styles.imageMall}>
                  <div className={styles.imageTitle}>{imageTitle}</div>
                </div>
              ) : null}
              {imageList?.map((item) => (
                <div
                  key={item.id}
                  className={`${styles.imageItem} ${imageId === item.id ? styles.active : null}`}
                  onClick={() => switchImageFunc(item)}
                >
                  <div className={styles.image}>{item.url ? <img src={item.url} alt='' /> : null}</div>
                  <div className={styles.imageInfo}>
                    <div className={styles.imageIcon}></div>
                    <div className={styles.imageTitle}>
                      <Ellipsis title={item.title} limit={18} wrapperTagName={styles.imageTitle} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
    </div>
  );
}

export default ImageTab;
