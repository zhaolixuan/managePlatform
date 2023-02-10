/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import React, { useRef, useEffect, useState } from 'react';
import { BaseMap, Popup, LayerCircle, MarkerCluster } from '@/components/DmapglMap';
import { LayerCircleJson, LayerCircleLayout, LayerCirclePaint } from './LayerCircle';
import { cluster1 } from './Cluster';

import styles from './index.module.less';

function Index() {
  // 根据数字大小获取尺寸
  function getLevelSize({
    minSize = 10,
    maxSize = 100,
    count = 1,
    rule = [
      {
        count: 10,
        size: 25,
      },
      {
        count: 20,
        size: 35,
      },
      {
        count: 50,
        size: 45,
      },
      {
        count: 80,
        size: 55,
      },
      {
        count: 150,
        size: 60,
      },
    ],
  }) {
    let result = rule?.[0]?.size;
    rule
      .sort((a, b) => b.count - a.count)
      .forEach((item) => {
        if (count < item.count) {
          result = item.size;
        }
      });
    if (result < minSize) {
      result = minSize;
    }
    if (result > maxSize) {
      result = maxSize;
    }
    return result;
  }
  // 自定义聚合点
  const clusterFactoryBlue = (e) => {
    const size = getLevelSize({ count: e.point_count });

    return (
      <div className='clusterContainer colorBlue' style={{ width: `${size}px`, height: `${size}px` }}>
        {e.point_count}
      </div>
    );
  };
  const markerFactoryBlue = (e) => <div className='markerContainer colorBlue'>{e.id}</div>;

  const style = {
    width: '100%',
    height: '100vh',
    minHeight: '1080px',
    position: 'absolute',
    zIndex: 0,
    top: 0,
    background: '#003d5c',
    // transform: `scale(${4800 / window.innerWidth})`,
  };
  return (
    <div style={style}>
      <BaseMap
        center={[116.402831, 39.918034]}
        maxBounds={[
          [115.402831, 38.918034],
          [117.402831, 40.918034],
        ]}
      >
        <Popup LngLat={[116.392196, 39.927994]} html='testtesttesttesttesttesttesttest' className='test' />
        <LayerCircle id='point' colors={['red']} data={LayerCircleJson} />
        <MarkerCluster
          data={cluster1}
          id='markerCluster1'
          markerFactory={markerFactoryBlue}
          clusterFactory={clusterFactoryBlue}
        />
      </BaseMap>
    </div>
  );
}
export default Index;
