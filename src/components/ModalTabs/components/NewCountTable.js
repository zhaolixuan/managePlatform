/* eslint-disable */
import { Table, Button } from '@jd/find-react';
import moment from 'moment';
import styles from './NewCountTable.module.less';


const Solution = ({ tableData = [], loading, desc = {}, requestParams, downloadWord }) => {

  const columns = [
    {
      title: '行政区',
      dataIndex: 'area',
      key: 'area',
      width: 80,
      align: 'center'
    },
    {
      title: '封控区数量（个）',
      dataIndex: 'lockdownCount',
      key: 'lockdownCount',
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
    {
      title: '封管控区涉及人口（人）',
      dataIndex: 'peopleNum',
      key: 'peopleNum',
      width: 100,
      render: (text) => (<>{text}</>),
      width: 100,
      align: 'center',
      sorter: (a, b) => {
        if (a.disabled || b.disabled) return;
        return a.peopleNum - b.peopleNum;
      },
      defaultSortOrder: 'descend',

    },
    {
      title: '保供场所数量（电商大仓）',
      dataIndex: 'warehouseCount',
      key: 'warehouseCount',
      width: 80,
      align: 'center'
    },
    {
      title: '保供场所数量（超市）',
      dataIndex: 'supermarketCount',
      key: 'supermarketCount',
      width: 80,
      align: 'center'
    },
    {
      title: '保供场所数量（前置仓）',
      dataIndex: 'prepositionCount',
      key: 'prepositionCount',
      width: 80,
      align: 'center'
    },
    {
      title: '保供场所数量（社区菜市场）',
      dataIndex: 'vegetableMarketCount',
      key: 'vegetableMarketCount',
      width: 80,
      align: 'center'
    },
    {
      title: '闭店情况',
      dataIndex: 'shutDownCount',
      key: 'shutDownCount',
      width: 80,
      align: 'center'
    },
    {
      title: '临时通行证车辆（车次）',
      dataIndex: 'throughTrainCount',
      key: 'throughTrainCount',
      width: 80,
      align: 'center'
    },
    {
      title: '蔬菜直通车（车次）',
      dataIndex: 'vegetableCount',
      key: 'vegetableCount',
      width: 80,
      align: 'center'
    },
  ];

  const download = async () => {
    const param = requestParams.area ? { overviewArea: requestParams.area || '', overviewDate: moment().format('YYYY-MM-DD HH:ss:mm') } : {}
    const res = await downloadWord(param);
    const url = window.URL.createObjectURL(res);
    const link = document.createElement('a');
    link.href = url;
    link.download = '应急保供工作报告.docx';
    link.click();
  }


  return (
    <div className={styles.solution_night}>
      {/* <div className={styles.title}>
        <img src={require('@/assets/images/solution_title_icon.png')} alt='' />
        保供方案汇总
      </div> */}
      <div className={styles.title}>
        <h2>应急保供工作报告</h2>
        <h4>(报送)</h4>
        <p><i>{desc.area}</i>，封控区<i>{desc.lockdownCount}</i>个，日环比{+desc.lockdownDayPercentum < 0 ? '减少' : '增加'}<i>{Math.abs(desc.lockdownDayPercentum)}</i>%；管控区<i>{desc.controlCount}</i>个，日环比{+desc.controlDayPercentum < 0 ? '减少' : '增加'}<i>{Math.abs(desc.controlDayPercentum)}</i>%。封管控区涉及人口<i>{desc.peopleNum}</i>人，{desc.area === '北京市' ? '全市' : desc.area}保供场所包括电商大仓<i>{desc.warehouseCount}</i>个，前置仓<i>{desc.prepositionCount}</i>个，超市<i>{desc.supermarketCount}</i>个，社区菜市场<i>{desc.vegetableMarketCount}</i>个。其中因疫情影响闭店数为<i>{desc.shutDownCount}</i>个，正常营业<i>{desc.normalCount}</i>个，正常营业占比<i>{desc.normalPercentum}</i>%，累计办理临时通行证<i>{desc.throughTrainCount}</i>辆，派出蔬菜直通车<i>{desc.vegetableCount}</i>车次。</p>
      </div>
      <Button type='info' className={styles.down_btn} onClick={download}>导出</Button>
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
          scroll={{ x: 'max-content' }}
          pagination={false}
        />
      </div>
    </div>
  );
};

export default Solution;
