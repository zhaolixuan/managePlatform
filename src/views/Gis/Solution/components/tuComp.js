/* eslint-disable import/no-dynamic-require */
/* eslint-disable @typescript-eslint/no-require-imports */
import { Table } from '@jd/find-react';
import { observer } from 'mobx-react';
import { useStore } from '@/hooks';
import styles from './tuComp.module.less';

const TuComp = ({ title, showParamaBtn }) => {
  const store = useStore('solution');
  const columns = [
    {
      title: '每人天需求',
      dataIndex: 'dayNeed',
      key: 'dayNeed',
      render: text => <>{text || '-'}</>
    },
    {
      title: '服务半径',
      dataIndex: 'serviceRadius',
      key: 'serviceRadius',
      render: text => <>{text || '-'}</>
    },
    {
      title: '不同距离服务量',
      dataIndex: 'distance',
      key: 'distance',
      render: text => <>{text || '-'}</>
    },
  ];

  const columns1 = [
    {
      title: '配送员需求',
      dataIndex: 'deliveryNeed',
      key: 'deliveryNeed',
      render: text => <>{text || '-'}</>
    },
    {
      title: '线下线上占比',
      dataIndex: 'onlineAndOffline',
      key: 'onlineAndOffline',
      render: text => <>{text || '-'}</>
    },
  ];
  const columns2 = [
    {
      title: '保供圈',
      dataIndex: 'guaranteCircle',
      key: 'guaranteCircle',
      render: text => <>{text || '-'}</>
    },
    {
      title: '保供点',
      dataIndex: 'guarantePoint',
      key: 'guarantePoint',
      render: text => <>{text || '-'}</>
    },
    {
      title: '昨日库存量（公斤）',
      dataIndex: 'yesterdayStock',
      key: 'yesterdayStock',
      render: text => <>{text || '-'}</>
    },
    {
      title: '蔬菜日进货量（公斤）',
      dataIndex: 'yesterdayPurchase',
      key: 'yesterdayPurchase',
      render: text => <>{text || '-'}</>
    },
    {
      title: '蔬菜库存量（公斤）',
      dataIndex: 'yesterdayVegetableStock',
      key: 'yesterdayVegetableStock',
      render: text => <>{text || '-'}</>
    },
    {
      title: '蔬菜日销售量（公斤）',
      dataIndex: 'vegetableDayStock',
      key: 'vegetableDayStock',
      render: text => <>{text || '-'}</>
    },
    {
      title: '建议对管控区供应量（公斤）',
      dataIndex: 'suggestReplenishment',
      key: 'suggestReplenishment',
      render: text => <>{text || '-'}</>
    },
  ];

  const columns3 = [
    {
      title: '保供点名称',
      dataIndex: 'guarantePointName',
      key: 'guarantePointName',
      render: text => <>{text || '-'}</>
    },
    {
      title: '与管控区距离（公里）',
      dataIndex: 'distance',
      key: 'distance',
      render: text => <>{text || '-'}</>
    },
    {
      title: '蔬菜日进货量（吨）',
      dataIndex: 'yesterdayPurchase',
      key: 'yesterdayPurchase',
      render: text => <>{text || '-'}</>
    },
    {
      title: '联系人',
      dataIndex: 'linkman',
      key: 'linkman',
      render: text => <>{text || '-'}</>
    },
    {
      title: '联系方式',
      dataIndex: 'contactWay',
      key: 'contactWay',
      render: text => <>{text || '-'}</>
    },
  ];

  const listData = [
    {
      title: '管控圈',
      name: '管控区蔬菜',
      info: store?.onePictureData?.iconVO?.controlCircle,
      color: 'rgba(166,161,114,1)',
    },
    {
      title: '生活圈',
      name: '生活圈蔬菜',
      info: store?.onePictureData?.iconVO?.lifeCircle,
      color: '#008435',
    },
    {
      title: '配送圈',
      name: '配送圈蔬菜',
      info: store?.onePictureData?.iconVO?.deliveryCircle,
      color: '#C917FF',
    },
    {
      title: '蔬菜直通车',
      name: '蔬菜直通车',
      info: store?.onePictureData?.iconVO?.directCar,
      color: '#5882EE',
    },
    {
      title: '市级保供',
      name: '新发地等市级保供资源',
      info: '',
      color: '',
    },
  ];
  return (
    <div className={styles.tabs_body_night}>
      <div className={styles.left}>
        <div className={styles.title}>
          <h2>{title}管控区域保供指挥图</h2>
          <div className={styles.date}>
            <span>北京市商务局 /</span>
            <span>2022-05-13</span>
          </div>
        </div>
        <div className={styles.img_wrap}>
          <img src={store?.onePictureData?.iconVO?.imgUrl} alt='' />
          <ul className={styles.info}>
            <li>
              <div className={styles.img_wrap_title}>
                <img src={require('@/assets/images/hu_icon.png')} alt='' />
                <span>户数</span>
              </div>
              <span>{store?.onePictureData?.iconVO?.controlHouseholds || 0}</span>
              <i>户</i>
            </li>
            <li>
              <div className={styles.img_wrap_title}>
                <img src={require('@/assets/images/ren_icon.png')} alt='' />
                <span>人口数</span>
              </div>
              <span>{store?.onePictureData?.iconVO?.peopleNum || 0}</span>
              <i>人</i>
            </li>
            <li>
              <p>
                封控小区：<span>{store?.onePictureData?.iconVO?.trafficControlPlotNum || 0}</span>
                <i>个</i>
              </p>
              {/* controlHouseholds */}
              <p>
                管控小区：<span>{store?.onePictureData?.iconVO?.controlPlotNum || 0}</span>
                <i>个</i>
              </p>
            </li>
          </ul>
        </div>
        <div className={styles.parameter}>
          <div className={styles.parameter_top}>
            <img src={require('@/assets/images/tu_title_icon.png')} alt='' />
            <h2>经验参数</h2>
            {console.log(showParamaBtn, 123)}
            {showParamaBtn && <div className={styles.btn} onClick={() => store.update({ paramsVisible: true })}>
              参数设置
            </div>}
          </div>
          <div className={styles.table_wrap}>
            <Table
              bordered
              dataSource={store?.onePictureData?.list1 || []}
              rowClassName={(record, index) => {
                if (index % 2) {
                  return styles.rows;
                }
                return styles.row;
              }}
              columns={columns}
              pagination={false}
            />
          </div>
          <div className={styles.table_wrap}>
            <Table
              rowClassName={(record, index) => {
                if (index % 2) {
                  return styles.rows;
                }
                return styles.row;
              }}
              dataSource={store?.onePictureData?.list2?.slice(0, 2) || []}
              bordered
              columns={columns1}
              pagination={false}
            />
          </div>
        </div>
      </div>
      <div className={styles.right}>
        <ul className={styles.list}>
          {listData.map((item, index) => (
            <li
              style={{
                backgroundImage: `url(${index !== 4 ? require(`@/assets/images/tu_q_${index + 1}.png`) : ''})`,
                backgroundSize: '100% 100%',
                backgroundPosition: '60px 35px',
                backgroundRepeat: 'no-repeat',
              }}
            >
              <div className={styles.list_title}>
                <img src={require(`@/assets/images/tu_${index + 1}.png`)} alt='' />
                <span>{item.title}</span>
              </div>
              <div className={styles.list_content}>
                <div className={styles.circle} style={{ background: item.color }}>
                  {index + 1}
                </div>
                <h4 className={styles.list_content_title}>{item.name}</h4>
                <div className={styles.list_content_info}>{item.info}</div>
              </div>
            </li>
          ))}
        </ul>
        <div className={styles.life}>
          <div className={styles.life_top}>
            <img src={require('@/assets/images/tu_title_icon.png')} alt='' />
            <h2>生活必需品调配调度方案表</h2>
          </div>
          <div className={styles.table_wrap}>
            <div className={styles.table_title}>
              <span>区级调配</span>
            </div>
            <Table
              rowClassName={(record, index) => {
                if (index % 2) {
                  return styles.rows;
                }
                return styles.row;
              }}
              bordered
              dataSource={store?.onePictureData?.regionDeployVOList || []}
              columns={columns2}
              pagination={false}
            />
          </div>
          <div className={styles.table_wrap}>
            <div className={styles.table_title}>
              <span>市级调配</span>
            </div>
            <Table
              rowClassName={(record, index) => {
                if (index % 2) {
                  return styles.rows;
                }
                return styles.row;
              }}
              bordered
              dataSource={store?.onePictureData?.cityLevelDeployVOList || []}
              columns={columns3}
              pagination={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default observer(TuComp);
