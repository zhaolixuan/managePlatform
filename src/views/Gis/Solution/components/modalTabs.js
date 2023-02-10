/* eslint-disable */
import { Modal, Tabs, Table } from '@jd/find-react';
import { useEffect, useState } from 'react';
import { useStore } from '@/hooks';
import BiaoComp from './biaoComp';
import TuComp from './tuComp';
import styles from './modalTabs.module.less'
import { observer } from 'mobx-react';
/**
 * requestParams：{
 * 是否必传： 是，
 * 参数列表：controlId：小区表id，必传，deliveryDayNum：配送人员需求-每快递每天配送量，
 *         deliveryHouse：每户人数-配送人员需求-平均每户人数；onlineAndOfflineScale：每户每天线上下单量-线上线下占比-线上/全量，
 *         personnelEveryDayVegetable：每人每天需求量(公斤)，serviceRadiusCar：蔬菜直通车半径；serviceRadiusDelivery：前置仓服务半径-配送圈；
 *         serviceRadiusLife：超市门店服务半径-生活圈，
 *         taskDelivery：3公里内门店配送比例基础任务量-配送圈；taskLife：1.5公里内门店配送比例-基础任务量-生活圈
 * }
 * 
 * title：小区名称，必传
 * isModalVisible：控制弹出框显示显示与隐藏 true/false，必传
 * showParamaBtn：是否显示参数设置按钮，true/false,非必传
 * onCancel: Modal关闭时的回调
 * 
 */

const moadlTabs = ({
  title, isModalVisible, setIsModalVisible,
  requestParams, showParamaBtn,
  onCancel
}) => {
  const store = useStore('solution');
  const [activeIndex, setActiveIndex] = useState(1);

  const columns = [
    {
      title: '参数名称',
      dataIndex: 'paramsName',
      key: 'paramsName',
    },
    {
      title: '默认参数值',
      dataIndex: 'paramsdefultValue',
      key: 'paramsdefultValue',
    },
    {
      title: '更新值',
      dataIndex: 'updateValue',
      key: 'updateValue',
    },
  ];

  const data = [
    {
      paramsName: '每人天蔬菜需求量',
      paramsdefultValue: '1.5公斤',
      updateValue: '12公斤',
    },
    {
      paramsName: '超市门店服务半径',
      paramsdefultValue: '1.5公里',
      updateValue: '12公斤',
    },
    {
      paramsName: '前置仓服务半径',
      paramsdefultValue: '3公里',
      updateValue: '12公斤',
    },
    {
      paramsName: '蔬菜直通车半径',
      paramsdefultValue: '15公里',
      updateValue: '12公斤',
    },
    {
      paramsName: '1.5公里内门店配送比例',
      paramsdefultValue: '70%',
      updateValue: '12%',
    },
    {
      paramsName: '3公里内门店配送比例',
      paramsdefultValue: '50%',
      updateValue: '12%',
    },
    {
      paramsName: '每快递员每天单量',
      paramsdefultValue: '50单',
      updateValue: '12单',
    },
    {
      paramsName: '每户人数',
      paramsdefultValue: '3人',
      updateValue: '12人',
    },
    {
      paramsName: '每户每天线上下单量',
      paramsdefultValue: '16.6%',
      updateValue: '12%',
    },
  ];

  // const tabList = [
  //   {
  //     name: '一图',
  //     icon: require('@/assets/images/tu_icon.png'),
  //     component: hiddenTu
  //   },
  //   {
  //     name: '一表',
  //     icon: require('@/assets/images/biao_icon.png')
  //   },
  // ];


  const footer = () => (<div className={styles.footer}>
    <div className={styles.btns} onClick={() => store.update({ paramsVisible: false })}>取消</div>
    <div className={styles.btns} onClick={() => store.update({ paramsVisible: false })}>确定</div>
  </div>)

  // 获取一图一表的数据
  const getOneTableData = () => {
    store.iconFormList(requestParams);
    store.iconPicture(requestParams);
  };

  useEffect(() => {
    requestParams.controlId && getOneTableData();
  }, [requestParams])

  return (
    <Modal
      visible={isModalVisible}
      zIndex={10001}
      centered
      // width='1840px'
      width='94%'
      bodyStyle={{
        minHeight: '928px',
        margin: 0
      }}
      footer={null}
      sticky
      onCancel={() => onCancel && onCancel()}
      destroyOnClose
      wrapClassName={styles.modal_wrap_night}
      closable={false}
    >
      <div className='tabs'>
        <div className='tabs_top'>
          <ul className='tabs_titles'>
          {/* {
            tabList.map((item, index) => <li onClick={() => setActiveIndex(index)} className={activeIndex === index && 'active'}> <img src={item.icon} alt="" /> {item.name}</li>)
          } */}
            {/* {!hiddenTu && <li onClick={() => setActiveIndex(0)} className={activeIndex === 1 && 'active'}> <img src={require('@/assets/images/tu_icon.png')} alt="" /> 一图</li>} */}
            <li onClick={() => setActiveIndex(1)} className={activeIndex === 1 && 'active'}> <img src={require('@/assets/images/biao_icon.png')} alt="" /> 一表</li>
          </ul>
          <img onClick={() => setIsModalVisible(false)} src={require('@/assets/images/clos_icon_night.png')} alt="" />
          {/* <img onClick={() => setIsModalVisible(false)} src={require('@/assets/images/clos_icon.png')} alt="" /> */}
        </div>
        {/* {activeIndex !== 1 ? <BiaoComp title={title} /> : <TuComp title={title} showParamaBtn={showParamaBtn} />} */}
        <BiaoComp title={title} /> 
      </div>

      <Modal
        visible={store.paramsVisible}
        zIndex={10001}
        centered
        width='513px'
        footer={footer()}
        onCancel={() => {
          store.update({ paramsVisible: false });
        }}
        destroyOnClose
        wrapClassName={styles.modal_wrap_night}
        closable={false}
      >
        <div className='params_body'>
          <div className='tabs_top'>
            <img src={require('@/assets/images/solution_title_icon.png')} alt='' />
            <img onClick={() => store.update({ paramsVisible: false })} src={require('@/assets/images/clos_icon_night.png')} alt="" />
            {/* <img onClick={() => setIsModalVisible(false)} src={require('@/assets/images/clos_icon.png')} alt="" /> */}
          </div>
          <div className='table_wrap' style={{ padding: '12px 8px 0' }}>
            <Table
              rowClassName={(record, index) => {
                if (index % 2) {
                  return styles.rows;
                }
                return styles.row;
              }}
              dataSource={data}
              columns={columns}
              pagination={false}
              rowKey='paramsName'
            />
          </div>
        </div>
      </Modal>

    </Modal>
  );
}

export default observer(moadlTabs);
