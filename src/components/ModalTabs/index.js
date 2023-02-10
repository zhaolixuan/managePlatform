/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-unused-vars */
import { observer } from 'mobx-react';
import { Modal, Tabs, Table } from '@jd/find-react';
import { useEffect, useState } from 'react';
import { useStore } from '@/hooks';
import ATable from './components/ATable'
import CountTable from './components/NewCountTable'
import styles from './index.module.less'

/**
 * 
 * @param {Boolean} isModalVisible 控制弹框显示隐藏
 * @param {string} title 一表的名称
 * @param {Object} requestParams 请求参数：id: 小区ID必传，deliveryRadius： 管控圈半径， liftRadius：生活圈半径, area: 行政区名字
 * @param {Number} type 2:显示总表，1:显示一表
 * @param {Boolean} showParamaBtn 控制弹框显示隐藏
 * @param {Function} onCancel 关闭弹框的回调
 * 
 */ 

const Solution = ({
  type = 1, title, isModalVisible,
  requestParams, showParamaBtn, onCancel, desc
}) => {
  const store = useStore('solution');

const getData = () => {
  if (!requestParams) return;
  type !== 1 ? store.queryBigChart(requestParams) : store.iconFormList(requestParams);
}

  useEffect(() => {
    getData();
  }, []);

  return (
    <Modal
      visible={isModalVisible}
      zIndex={10001}
      // width='1840px'
      width='82%'
      bodyStyle={{
        // height: '50%',
        margin: 0,
        padding:0,
        overflow: 'hidden auto'
      }}
      footer={null}
      centered
      stickys
      onCancel={() => onCancel && onCancel()}
      destroyOnClose
      wrapClassName={styles.modal_wrap_night}
      closable={false}
    >
      <div className='tabs_top'>
        <img src={require('@/assets/images/solution_title_icon.png')} alt='' />
        <img onClick={() => onCancel && onCancel()} src={require('@/assets/images/clos_icon_night.png')} alt='' />
        {/* <img onClick={() => setIsModalVisible(false)} src={require('@/assets/images/clos_icon.png')} alt="" /> */}
      </div>
      {type === 1 ? <ATable tableData={store?.oneTableData} loading={store?.loading} title={title} downloadExecl={store.downloadExecl} requestParams={requestParams} />
        : <CountTable requestParams={requestParams} downloadWord={store.downloadWord} loading={store?.loading} tableData={store?.tableData?.overviewListVOList || []} desc={desc}/>}
    </Modal>
  );
};

export default observer(Solution);
