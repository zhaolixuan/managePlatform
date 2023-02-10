import styles from './card.module.less';

function Card({ title, hasHead = true, ext = '', style, children }) {
  return (
    <div className={styles.card} style={style}>
    {hasHead ? (
      <div className={styles.cardHead}>
        <div className={styles.cardTitle}>{title}</div>
        <div className={styles.cardUnit}> {ext} </div>
      </div>
        ) : null}
      <div className={styles.cardContent}>{children}</div>
    </div>
  );
}

export default Card;
