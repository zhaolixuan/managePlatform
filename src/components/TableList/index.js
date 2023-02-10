/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
import { useState,useRef } from 'react';
import { Table } from '@jd/find-react';
import defIcon from '@/assets/images/table_title_icon.png';
import styles from './index.module.less';
/**
 *
 * @param {Array} dataSource 列表数据
 * @param {Array} columns 表头
 * @param {Object/Boolean} pagination 是否显示分页默认不展示
 * @param {String} rowKey table列表key
 * @param {String} title 标题
 * @param {Object} style 组件显示的位置 例如： {top: 20, left: 40}
 * @param {Object} icon icon图标
 * @param {Function} onClick 点击行的点击事件
 */
const TableList = ({
  dataSource = [],
  columns = [],
  title = '',
  rowKey = '',
  pagination = false,
  styleType = 'enclosure',
  icon,
  onClick,
  cilckTitle,
}) => {
  const tableListRef = useRef(null);
  const getScroll = () => {
    const height = tableListRef?.current?.offsetHeight;
    return { y: height - 112};
  };

  const [active, setActive] = useState(null);

  return (
    <div className={`${styles.table_list} ${styles[`${styleType}Table`]}`} ref={tableListRef}>
      <div className={styles.top}>
        <img className={styles.icon} alt='' src={icon || defIcon} />
        <div className={styles.title}>{title}</div>
        {cilckTitle && cilckTitle && !sessionStorage.getItem('area') && <span onClick={()=>{setActive('北京');cilckTitle('北京')}}>北京</span>}
      </div>
      <Table
        className={styles.table}
        rowClassName={(record, index) => {
          if (index === active || record.area === sessionStorage.getItem('area') ) {
            return styles.active;
          }
          if (index % 2) {
            return styles.t_items;
          }
          return styles.t_item;
        }}
        rowKey={rowKey}
        dataSource={dataSource}
        columns={columns}
        onRow={(record, index) => ({
          onClick: (event) => {
            if(sessionStorage.getItem('area') && sessionStorage.getItem('area') !== record.area) return;
            onClick && onClick(record, index);
            setActive(index);
          },
        })}
        tableLayout='fixed'
        scroll={getScroll()}
        pagination={pagination}
      />
    </div>
  );
};

export default TableList;
