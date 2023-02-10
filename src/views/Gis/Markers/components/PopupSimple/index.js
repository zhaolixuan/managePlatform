import styles from './index.module.less';

const PopupContent = ({ data }) => {
  const { title = '', detail = {} } = data;
  const dateLabel = ['年', '月', '日'];

  return (
    <div className={`${styles['site-popup-wrapper']} ${styles[`pop-area-${detail.type}`]}`}>
      <div className={styles.header}>{title}</div>
      <div className={styles['content-wrapper']}>
        <div className={styles['detail-name']}>封控时间</div>
        <div className={styles['detail-value']}>
          {detail.time &&
            detail.time.split('-').map((el, index) => (
              <>
                <span>{el}</span>
                {dateLabel[index]}
              </>
            ))}
        </div>
      </div>
    </div>
  );
};

export default PopupContent;
