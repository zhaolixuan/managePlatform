/* eslint-disable no-unused-vars */
import { Table } from '@jd/find-react';
import { observer } from 'mobx-react';
import { useState } from 'react';
import { useStore } from '@/hooks';
import styles from './truck.module.less';

const TruckList = (props) => {
  // const { showTracksTable, setShowTracksTable } = useStore('gis');

  const { columns = [], dataSource = [], rowKey = '', style = {}, options = {}, styleType = '' } = props;
  const [rowId, setRowId] = useState();

  const getScroll = () => {
    return style.height ? { y: style.height - 92 } : null;
  };

  const getRowClass = (record) => {
    return record[rowKey] === rowId ? 'active' : '';
  };

  const switchRow = (row) => {
    const { selectRowChange } = props;
    setRowId(row[rowKey] === rowId ? undefined : row[rowKey]);
    selectRowChange && selectRowChange(row[rowKey] === rowId ? undefined : row);
  };

  const closeTableFunc = () => {
    const { closeTable } = props;
    closeTable && closeTable();
  };

  const showMoreFunc = () => {
    const { showMore } = props;
    showMore && showMore();
  };

  return (
    <div className={styles.truckList}>
      <div className={`${styles.truckList} ${styleType ? styles[styleType] :''}`} style={style}>
        <div className={styles.tableTabHead}>
          <div className={styles.tableTabTitle}>
            <span>{options.title || ''}</span>
            <div className={styles.showMoreBtn} onClick={showMoreFunc}>
              更多
            </div>
          </div>
          <div className={styles.tableTabNum}>{options.unit || ''}</div>
          {options.canClose ? <div className={styles.tableTabClose} onClick={closeTableFunc}></div> : null}
        </div>
        <div className={styles.tableTabContent}>
          <Table
            columns={columns}
            dataSource={dataSource}
            rowClassName={getRowClass}
            onRow={(record) => {
              return {
                onClick: () => switchRow(record),
              };
            }}
            tableLayout='fixed'
            rowKey={rowKey}
            scroll={getScroll()}
            pagination={false}
          />
        </div>
      </div>
    </div>
  );
};

export default observer(TruckList);
