/* eslint-disable  */

import { checkList } from '@/views/Gis/Site/config'
import styles from './index.module.less';

const PlaceNumber = ({ list = [], style = {}, theme = 'white' }) => {
    const context = require.context('@/assets/images', true, /.png$/);
    return (
        <div className={styles.place_num} style={style}>
            {/* <div className={styles.top}>场所数量</div> */}
            <ul className={styles.list}>
                {list.map((item, index) => (
                    <li key={`place_num_${index}`}>
                        <img src={context(`./${theme}/place_num${item.businessType}.png`)} alt="" />
                        <div className={styles.tip}>
                            <span>{item.typeName}</span>
                            <p className={styles.num}>{item.number}<i>个</i></p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PlaceNumber;
