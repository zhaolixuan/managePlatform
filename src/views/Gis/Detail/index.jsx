import React from 'react';
import { observer, inject } from 'mobx-react';
import { useRouter } from '@/hooks'; // 业务中，和路由相关的使用此hooks
import GisMap from '@/components/GisMap';

function GisDetail({ gis }) {
  const { demoList } = gis;
  const {
    query: { name },
  } = useRouter();

  return (
    <>
      <GisMap gisData={demoList}>
        <div className='show'>query为:{name}</div>
      </GisMap>
    </>
  );
}

export default inject('gis')(observer(GisDetail));
