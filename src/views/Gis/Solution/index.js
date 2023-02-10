/* eslint-disable */
import { Tag, Table } from '@jd/find-react';
import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import { useStore } from '@/hooks';
// import MoadlTabs from './components/modalTabs';
import styles from './index.module.less';


const Solution = () => {
  const store = useStore('solution');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [params, setParams] = useState({});

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
    // {
    //   title: '保供方案',
    //   dataIndex: 'programme',
    //   key: 'programme',
    //   width: 200,
    //   align: 'center',
    //   render: (text) => (
    //     <div style={{ textAlign: 'left', display: 'flex', flexWrap: 'wrap' }}>

    //       {text && text?.map((item) => (
    //         <Tag
    //           // color='#108ee9'
    //           color='rgba(2,255,255,0.2);'
    //           onClick={() => { setParams({ ...params, controlId: item.id }); setTitle(item.name); setIsModalVisible(true) }}
    //         >
    //           {item.name}
    //         </Tag>

    //       ))}
    //     </div>
    //   ),
    // },
  ];

  useEffect(() => {
    store.queryChart();
  }, []);

  return (
    <>
    <div className={styles.solution_night}>
      <div className={styles.title}>
        <img src={require('@/assets/images/solution_title_icon.png')} alt='' />
        保供方案汇总
      </div>
      <div className={styles.solution_body}>
        <Table
          columns={columns}
          dataSource={store?.tableData?.statisticals || []}
          bordered
          size='middle'
          rowKey='id'
          // expandable={{
          //   expandedRowRender: ({ childrenList }) => (
          //     <div style={{ margin: 0 }}>
          //       {childrenList?.map((item) => (
          //         <div>{item.area}</div>
          //       ))}
          //     </div>
          //   ),
          //   rowExpandable: (record) => record?.key === '1',
          // }}
          rowClassName={(record, index) => {
            if (index % 2) {
              return styles.rows;
            }
            return styles.row;
          }}
          scroll={{ x: 'max-content', y: '711px' }}
          pagination={false}
        />
        {/* <MoadlTabs
          isModalVisible={isModalVisible}
          setIsModalVisible={setIsModalVisible}
          title={title}
          setTitle={setTitle}
          requestParams={params}
          showParamaBtn
          onCancel={() => {
            setIsModalVisible(false);
            setTitle('');
          }}
        /> */}
      </div>
    </div>
    </>
  );
};

export default observer(Solution);
