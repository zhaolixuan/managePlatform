import { useEffect } from 'react';
import styles from './index.module.less';
import Card from '@/components/Card';

/**
 *
 * @param {Array} data 数据
 * @returns
 */
function OverView({ data = [], title, ext, heightType, pointName, moreBtn, btnTitle, handleClick}) {
  const onClick = () => {
    handleClick()
  };
  useEffect(() => {

  }, []);

  return (
    <div className={styles.overViewBox}>
      <div className={styles.boxShadow}>
        <Card title={title} ext={ext} style={{ position: 'relative' }} className={`${styles[`height${heightType}`]}`}>
          {
            pointName && <div className={styles.point_name} key={11}>
              <div>
                {
                  pointName || '-'
                }
              </div>
              
            </div>
          }
          <div className={styles.card_content}>
            {data.length? data?.map(({ type, count, unit = null, isTitle }, index) => {
              return (
                <div className={styles.item} key={index}>
                  <div className={styles.title}>{type}</div>
                  <div className={styles.desc}>
                    {
                      !isTitle ? <span className={styles.num}>{ count === 0 ? count : (count !== 'null' && count !== 'undefined' && count)? count : '-' }</span> : null
                    }
                    <span className={styles.unit}>{unit}</span>
                  </div>
                </div>
              );
            }): (
              <div className={styles.no_data}>暂无数据</div>
            )}
          </div>
          {moreBtn? (
              <div className={`${styles.more_btn}`} onClick={() => onClick(true)} >{btnTitle}</div>
            ) : ('')}
        </Card>
      </div>
    </div>
  );
}
export default OverView;
