/* eslint-disable no-unused-vars */
import { Table, Empty } from '@jd/find-react';
import { toJS } from 'mobx';
import { useState, useRef} from 'react';
import styles from './index.module.less';

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
  } = props;

  return (
    <div className={styles.tableTabContent}>
      <Table
        columns={columns}
        dataSource={dataSource}
        // tableLayout='fixed'
        rowKey={rowKey}
        pagination={false}
      />
    </div>
  );
}

export default TableTab;
