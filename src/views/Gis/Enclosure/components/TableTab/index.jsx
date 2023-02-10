/* eslint-disable no-unused-vars */
import { Table } from '@jd/find-react';
import { toJS } from 'mobx';
import { useState, useRef } from 'react';
import styles from './table.module.less';

/**
 *
 * @param {String} props.options.title 表格头部标题
 * @param {String} props.options.unit 表格头部右侧数量
 * @param {Boolean} props.options.canClose 表格头部右侧数量
 * @param {Array} props.columns 表格列的配置
 * @param {Array} props.dataSource 表格数据
 * @param {String} props.rowKey 表格行id
 * @param {Number} props.style.width tab宽度
 * @param {Number} props.style.height tab高度，不传默认自动延伸
 * @param {Function} props.selectRowChange 表格选中行的事件
 * @returns 表格tab
 */
function TableTab(props) {
  const {
    columns = [],
    dataSource = [],
    rowKey = '',
    style = {},
    options = {},
    cilckTitle,
    border = true,
    line = false,
    TabsList = [],
    activeKey = null,
    changeTabs,
    countKey = null
  } = props;
  const [rowId, setRowId] = useState();
  const entableTabRef = useRef(null);
  const dpr = Math.round((Number(document.querySelector('html').style.fontSize.slice(0, -2))))
  const getScroll = () => {
    const height = entableTabRef?.current?.offsetHeight;
    return { y: height - ((68/100)*dpr)};
  };

  const getRowClass = (record) => {
    return (rowId && record[rowKey] === rowId) || (sessionStorage.getItem('area') && record[rowKey] === sessionStorage.getItem('area')) ? 'active' : '';
  };

  const switchRow = (row) => {
    const { selectRowChange } = props;
    selectRowChange && setRowId(row[rowKey] === rowId ? undefined : row[rowKey]);
    // selectRowChange && selectRowChange(row[rowKey] === rowId ? undefined : row);
    selectRowChange && selectRowChange(row);
  };

  const closeTable = () => {
    const { tableClose } = props;
    tableClose(false);
  };

  const count = () => {
    // console.log(countKey);
    let num = 0;
    for(let i = 0; i < dataSource.length; i++) {
      num+=dataSource[i][countKey];
    };
    return num;
  };

  const onClick = () => {
    const { handleClick } = props;
    handleClick()
  };

  return (
    <div
      ref={entableTabRef}
      className={`${styles.tableTab} ${!border ? '' : styles.borderTable} ${line ? styles.line_margin : ''}`}
      style={style}
    >
      {TabsList.length > 0 && <ul className={styles.tabs_titles}>

        {
          TabsList.map(item => <li className={activeKey === item.key ? styles.active : ''} onClick={() => changeTabs && changeTabs(item.key)}> <img src={item.icon} alt='' /> {item.title}</li>)
        }
      </ul>}
      {TabsList.length > 0 && <div className={styles.count}>
        合计： {count()}
      </div>}
      <div className={styles.tableTabHead}>
        <div className={styles.tableTabTitle}>{options.title || ''}</div>
        <div className={styles.tableTabNum}>{options.unit || ''}</div>
        {cilckTitle && (
          <span onClick={cilckTitle} className={styles.title}>
            北京
          </span>
        )}
        {options.canClose ? <div className={styles.tableTabClose} onClick={closeTable}></div> : null}
      </div>
      <div className={styles.tableTabContent}>
        <Table
          columns={columns}
          dataSource={dataSource}
          rowClassName={getRowClass}
          onRow={(record) => {
            // console.log(record, '1122');
            return {
              onClick: () => {
                if (!record) return;
                if (cilckTitle && sessionStorage.getItem('area') && sessionStorage.getItem('area') !== record.area)
                  return;
                switchRow(toJS(record));
              },
            };
          }}
          tableLayout='fixed'
          rowKey={rowKey}
          scroll={getScroll()}
          pagination={false}
        />
        <div className={styles.bg_btn} onClick={() => onClick()} >生成一表</div>
      </div>
    </div>
  );
}

export default TableTab;
