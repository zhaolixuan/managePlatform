// import { useEffect, useState } from 'react';
import { Input, DatePicker } from '@jd/find-react';
import { useStore } from '@/hooks';
import styles from './index.module.less';

function CarInSearch() {
  const store = useStore('carIn');

  const onDateChange = (date, dateString) => {
    store.selectTime(dateString);
  };
  const onSelectChange = (data) => {
    store.setSearchKey(data);
  };
  return (
    <div className={styles.carInSearch_wrap}>
      <DatePicker className={styles.date_wrap} onChange={onDateChange} />
      <Input.Search allowClear className={styles.input} placeholder='请输入地址' style={{ width: 334, height: 32 }} onSearch={onSelectChange}/>
    </div>
  );
}

export default CarInSearch;
