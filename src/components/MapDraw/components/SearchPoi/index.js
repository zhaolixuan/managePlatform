/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Input, message, Tooltip, Button } from '@jd/find-react';
import Marker from '@/components/DmapglMap/Marker';
import styles from './index.module.less';

const SearchPoi = ({
  style,
  defaultValue,
  placeholder,
  searchMethod,
  map,
  setCurCoord,
  curSearchCoord,
  setIsFirstSearch,
  isFirstSearch,
  setSearched,
  searched,
  initDrawData,
  curDrawMpde,
  setQuickAddMarkerStatus,
  quickAddMarkerStatus,
  pointGeojsonData,
}) => {
  const { Search } = Input;

  const handleSearch = async (value) => {
    let formatedData;
    if (typeof value === 'string') {
      if(!value){
        message.warn('请输入内容后进行搜索')
        return;
      }
      formatedData = value;
    } else {
      if(!value?.target?.value){
        message.warn('请输入内容后进行搜索')
        return;
      }
      formatedData = value.target.value;
    }
    const res = await searchMethod({
      method: 'get',
      path:"/jinxin/icity-support-screen/AddrCode/cmd",
      param:{"address": formatedData,"output":"JSON","batch":"true","coord":"cgcs2000","adcode":"yes"}
    });
    if (res.length === 0) {
      message.error('未查询到');
      setCurCoord([]);
      return;
    }
    const { location } = res[0];
    const lng = +location.split(',')[0].replace('"', '');
    const lat = +location.split(',')[1].replace('"', '');
    map.easeTo({ center: [lng, lat] });
    setCurCoord([lng, lat]);
    setIsFirstSearch(false);
    setSearched(true);
  };

  return (
    <div>
      <Search
        onSearch={handleSearch}
        style={style}
        defaultValue={defaultValue}
        placeholder={placeholder}
        onPressEnter={handleSearch}
      />
      {!quickAddMarkerStatus && searched && curSearchCoord?.length > 0
       && !Object.keys(pointGeojsonData).length > 0 && curDrawMpde !== 'draw_polygon'
       && !initDrawData && (
        <Tooltip placement='right' title='快速打点小工具：当在搜索有结果时，支持直接打点'>
          <div className={styles['quick-add-marker']}>
            <Button
              // disabled={}
              className={styles['location-tool-wrapper']}
            >
              <img
                onClick={() => {
                  setQuickAddMarkerStatus(true);
                }}
                src={require('../../assets/icons/location-icon.png')}
                alt='点'
                key='point'
              />
            </Button>
          </div>
        </Tooltip>
      )}
      {curSearchCoord.length > 0 && (
        <Marker LngLat={curSearchCoord} map={map}>
          <img src={require('../../assets/icons/origin-marker-icon.png')} alt='中心点' />
        </Marker>
      )}
    </div>
  );
};

export default SearchPoi;
