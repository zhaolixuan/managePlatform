import styles from './card.module.less';

function Card({ title = '', hasHead = true, heightType, ext = '', style, children }) {
  return (
    <div className={`${styles.card} ${heightType ? styles[`height${heightType}`] :''}`} style={style} >
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
