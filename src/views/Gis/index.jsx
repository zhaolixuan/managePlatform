/* eslint-disable no-unused-vars */
import React from 'react';
import { observer, inject } from 'mobx-react';
import { useRouter } from '@/hooks'; // 业务中，和路由相关的使用此hooks
import GisMap from '@/components/GisMap';
import Site from './Site';
import styles from './index.module.less';

function GisIndex({ gis }) {
  const { demoList, getInterfaceList } = gis;
  const { push } = useRouter();

  // 获取地图样例数据
  const getGisDemoData = () => {
    getInterfaceList({});
  };

  // 跳转路由
  const gotoPage = () => {
    // 跳转到列表数据
    push({
      path: '/gis/detail',
      query: {
        name: 'xxx',
      },
    });
  };

  return (
    <>
      <GisMap gisData={demoList}>
        <Site />
        {/* <div className={styles.next_page} onClick={gotoPage}>
            点击跳转到下一页
          </div>
          <div className='show' onClick={getGisDemoData}>
            点击加载Gis地图实例
          </div> */}
      </GisMap>
    </>
  );
}

export default inject('gis')(observer(GisIndex));
