import { Table } from '@jd/find-react';
import { observer } from 'mobx-react';
import { useStore } from '@/hooks';
import styles from './biaoComp.module.less';

const BiaoComp = ({ title }) => {
  const store = useStore('solution');
  const columns = [
    {
      title: '序号',
      dataIndex: 'area',
      key: 'area',
      render: (_, item, index) => <>{index + 1}</>,
    },
    {
      title: '场所名称',
      dataIndex: 'siteName',
      key: 'siteName',
    },
    {
      title: '联系人',
      dataIndex: 'linkman',
      key: 'linkman',
    },
    {
      title: '联系电话',
      dataIndex: 'linkPhone',
      key: 'linkPhone',
    },
    {
      title: '保供圈类型',
      dataIndex: 'region',
      key: 'region',
    },
    {
      title: '昨日库存量（公斤）',
      dataIndex: 'yesterdayStock',
      key: 'yesterdayStock',
    },
    {
      title: '蔬菜日进货量（公斤）',
      dataIndex: 'yesterdayPurchase',
      key: 'yesterdayPurchase',
    },
    {
      title: '蔬菜库存量（公斤）',
      dataIndex: 'yesterdayVegetableStock',
      key: 'yesterdayVegetableStock',
    },
    {
      title: '蔬菜日销售量（公斤）',
      dataIndex: 'vegetableDayStock',
      key: 'vegetableDayStock',
    },
    {
      title: '建议对管控区补货量(公斤）',
      dataIndex: 'suggestReplenishment',
      key: 'suggestReplenishment',
    },
  ];
  return (
    <div className={styles.tabs_body_biao_night}>
      <div className={styles.title}>
        <h2>{title}管控区域保供指挥图</h2>
        <div className={styles.date}>
          <span>北京市商务局 /</span>
          <span>2022-05-13</span>
        </div>
      </div>
      <Table
        rowClassName={(record, index) => {
          if (index % 2) {
            return styles.rows;
          }
          return styles.row;
        }}
        dataSource={store?.oneTableData || []}
        columns={columns}
        scroll={{ x: 'max-content' }}
        pagination={false}
      />
    </div>
  );
};

export default observer(BiaoComp);
