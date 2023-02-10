/* eslint-disable */
import { Table } from '@jd/find-react';
import styles from './CountTable.module.less';


const Solution = ({ tableData = [], loading, desc={} }) => {

  const columns = [
    {
      title: '行政区',
      dataIndex: 'area',
      key: 'area',
      width: 80,
      align: 'center'
    },
    {
      title: '封管控区数量',
      children: [
        {
          title: '封控区数量（个）',
          dataIndex: 'sealingCount',
          key: 'sealingCount',
          width: 100,
          align: 'center'
        },
        {
          title: '管控区数量（个）',
          dataIndex: 'controlCount',
          key: 'controlCount',
          width: 100,
          align: 'center'
        },
      ],
    },
    {
      title: '封管控区居民需求量',
      children: [
        {
          title: '封管控区涉及人口（万人）',
          dataIndex: 'population',
          key: 'population',
          width: 100,
          render: (text) => (<>{(text * 1) ? (text * 1)?.toFixed(4) : text}</>),
          width: 100,
          align: 'center',
          sorter: (a, b) => {
            if (a.disabled || b.disabled) return;
            return a.population - b.population;
          },
          defaultSortOrder: 'descend',

        },
        {
          title: '蔬菜需求量（万公斤）',
          dataIndex: 'vegetableDemand',
          key: 'vegetableDemand',
          render: (text) => (<>{(text * 1) ? (text * 1)?.toFixed(4) : text}</>),
          width: 100,
          align: 'center'
        },
        {
          title: '配送人员需求数（人）',
          dataIndex: 'distributionCount',
          key: 'distributionCount',
          width: 100,
          align: 'center'
        },
      ],
    },
    {
      title: '保供能力',
      dataIndex: 'placeCount',
      key: 'placeCount',
      width: 80,
      children: [
        {
          title: '保供场所数量',
          dataIndex: 'placeCount',
          key: 'placeCount',
          width: 80,
          align: 'center'
        },
        {
          title: '封管控区内蔬菜日库存（万公斤）',
          dataIndex: 'vegetableSales',
          key: 'vegetableSales',
          width: 100,
          align: 'center',
          render: (text) => (<>{(text * 1) ? (text * 1)?.toFixed(4) : text}</>)
        },
        {
          title: '3公里保供圈蔬菜支持封管控区日供应（万公斤）',
          dataIndex: 'guaranteeSupplyCount',
          key: 'guaranteeSupplyCount',
          width: 100,
          align: 'center',
          render: (text) => (<>{(text * 1) ? (text * 1)?.toFixed(4) : text}</>)
        },
        {
          title: '蔬菜直通车日供应量（万公斤）',
          dataIndex: 'throughTrainCount',
          key: 'throughTrainCount',
          width: 100,
          align: 'center',
          render: (text) => (<>{(text * 1) ? (text * 1)?.toFixed(4) : text}</>)
        },
        {
          title: '封管控区白名单配送人员',
          dataIndex: 'whiteListDistribution',
          key: 'whiteListDistribution',
          width: 100,
          align: 'center',
        },
        {
          title: '缺口量（万公斤）',
          dataIndex: 'notch',
          key: 'notch',
          width: 100,
          align: 'center',
          render: (text) => (<>{(text * 1) ? (text * 1)?.toFixed(4) : text}</>)
        },
        {
          title: '需要派出的直通车（辆）',
          dataIndex: 'dispatchedCar',
          key: 'dispatchedCar',
          width: 100,
          align: 'center',
        },
      ],
    },
  ];


  return (
    <div className={styles.solution_night}>
      {/* <div className={styles.title}>
        <img src={require('@/assets/images/solution_title_icon.png')} alt='' />
        保供方案汇总
      </div> */}
      <div className={styles.title}>
        <h2>应急保供工作报告</h2>
        <h4>(报送)</h4>
        <p>{`全市封控区${desc.lockdownCount}个，管控区${desc.controlCount}个，日环比增加${desc.dayPercentum}%。封管控区涉及人口${desc.peopleNum}人，全市保供场所包括电商大仓${desc.warehouseCount}个，前置仓${desc.prepositionCount}个，超市${desc.supermarketCount}个，社区菜市场${desc.vegetableMarketCount}个。其中因疫情影响闭店数为${desc.shutDownCount}个，正常营业${desc.normalCount}个，正常营业占比${desc.normalPercentum}%，临时直通车${desc.throughTrainCount}车次，蔬菜直通车${desc.vegetableCount}车次。`}</p>
      </div>
      <div className={styles.solution_body}>
        <Table
          columns={columns}
          dataSource={tableData || []}
          bordered
          loading={loading}
          size='middle'
          rowKey='id'
          rowClassName={(record, index) => {
            if (index % 2) {
              return styles.rows;
            }
            return styles.row;
          }}
          scroll={{ x: 'max-content', y: '711px' }}
          pagination={false}
        />
      </div>
    </div>
  );
};

export default Solution;
