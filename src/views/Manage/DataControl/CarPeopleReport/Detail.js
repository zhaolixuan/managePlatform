import React, { useState } from 'react';
import { toJS } from 'mobx';
import { Input, Modal } from '@jd/find-react';
import styles from './index.module.less';

const Detail = ({ detailVisible, setDetailVisible, data: modalData = {} }) => {
  const dataRelation = [
    { key: '所属企业', value: 'companyName' },
    { key: '来源地', value: 'provenance' },
    { key: '司机姓名', value: 'driverName' },
    { key: '司机身份证号', value: 'driverIdNumber' },
    { key: '车牌号', value: 'plateNumber' },
    { key: '随车人员姓名', value: 'togetherName' },
    { key: '随车人员手机号', value: 'togetherTel' },
    { key: '预计出发时间', value: 'expectDepartureTime' },
    { key: '确认状态', value: 'confirmStatus' },
    { key: '确认时间', value: 'confirmTime' },
    { key: '审核状态', value: 'auditStatus' },
    { key: '审核时间', value: 'auditTime' },
    { key: '白名单生成时间', value: 'whiteCreateTime' },
    { key: '进入新发地状态', value: 'arrivedStatus' },
  ];

  // 获取随行人员的列表
  const togetherName = (Object.keys(modalData).length && modalData.togetherInfoVos.map((i) => {return i.togetherName})) || [];
  const togetherTel = (Object.keys(modalData).length && modalData.togetherInfoVos.map((i) => i.togetherTel)) || [];
  const togetherObj = {
    togetherName: togetherName,
    togetherTel: togetherTel,
  };

  // 关闭的操作
  const handleCancel = () => {
    setDetailVisible(false);
  };

  return (
    <div>
      <Modal title='详情' visible={detailVisible} onCancel={handleCancel} footer={null}>
        {dataRelation.map((i) => {
          return i.value.includes('together') ? (
            <div className={styles['detail-item-wrapper']}>
              <div>{i.key}</div>
              <Input disabled value={togetherObj[i.value].join()} />
            </div>
          ) : (
            <div className={styles['detail-item-wrapper']}>
              <div>{i.key}</div>
              <Input disabled value={modalData[i.value]} />
            </div>
          );
        })}
      </Modal>
    </div>
  );
};

export default Detail;
