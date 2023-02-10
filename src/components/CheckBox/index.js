/* eslint-disable */
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import { difference } from 'lodash'
import { Checkbox } from '@jd/find-react';
import { useStore, useRouter } from '@/hooks';
import styles from './index.module.less';

/**
 * @params {array} defaultValue 初始选中值
 * @params {array} data 传入的数据，包括label、icon以及value
 * @params {array} defaultCheckList 默认选中值
 * @params {function} allList 全部选项
 * @params {boolean} isConfig 是否可配置
 * @params {function} setCheckBoxValue 当选中之后的回调函数
 * @params {function} configCheckList 弹窗中，选择回调函数
 * @returns
 */

const CheckBox = ({
  defaultValue = [],
  data = [
    {
      label: '123',
      icon: 'wholeSaleMarket',
      value: '123',
    },
    {
      label: '123',
      icon: 'foodMarket',
      value: '456',
    },
    {
      label: '123',
      icon: 'codeChain',
      value: '789',
    },
  ],
  defaultCheckList = [],
  allList = [],
  isConfig = false,
  setCheckBoxValue,
  configCheckList,
  theme = 'white'
}) => {
  let relation = {
    
      codeChain: require(`@/assets/checkbox-${theme}/code-chain-checkbox.png`), // 冷链卡口
      hignwayStation: require(`@/assets/checkbox-${theme}/hignway-station-checkbox.png`), // 高速收费站
      foodMarket: require(`@/assets/checkbox-${theme}/food-market-checkbox.png`), // 社区菜市场
      bannedArea: require(`@/assets/checkbox-${theme}/banned-area-checkbox.png`), // 封控区
      manageArea: require(`@/assets/checkbox-${theme}/manage-area-checkbox.png`), // 管控区
      prewarnArea: require(`@/assets/checkbox-${theme}/prewarn-area-checkbox.png`), // 防范区
      temporaryManageArea: require(`@/assets/checkbox-${theme}/temporary-manage-area-checkbox.png`), // 临时管控区
      wholeSaleMarket: require(`@/assets/checkbox-${theme}/whole-sale-market-checkbox.png`), // 批发市场
      superMarket: require(`@/assets/checkbox-${theme}/super-market-checkbox.png`), // 连锁超市
      directSale: require(`@/assets/checkbox-${theme}/direct-sale-checkbox.png`), // 直营直供
      leadWarehouse: require(`@/assets/checkbox-${theme}/lead-warehouse-checkbox.png`), // 前置仓
      staff: require(`@/assets/checkbox-${theme}/staff-checkbox.png`), // 人员
      vehicle: require(`@/assets/checkbox-${theme}/vehicle-checkbox.png`), // 车辆  
      whiteList: require(`@/assets/checkbox-${theme}/white-bike-checkbox.png`), // 白名单
      window: require(`@/assets/checkbox-${theme}/yellow-bike-checkbox.png`), // 弹窗
      isolation: require(`@/assets/checkbox-${theme}/red-bike-checkbox.png`), // 隔离
      eleSuppliesWarehouse: require(`@/assets/checkbox-${theme}/electric-supplies-warehouse-checkbox.png`), // 电商大仓
      vegetableCar: require(`@/assets/checkbox-${theme}/vegetable-car-checkbox.png`), // 蔬菜直通车
      logisticsLine: require(`@/assets/checkbox-${theme}/logistics-line-checkbox.png`), // 物流线
      marketStore: require(`@/assets/checkbox-${theme}/market-store-checkbox.png`), // 超市门店
      closeShop: require(`@/assets/checkbox-${theme}/close-shop-checkbox.png`), // 关停门店
      temporaryPass: require(`@/assets/checkbox-${theme}/temporary-pass-checkbox.png`), // 京内临时通行证
      zoneSupplySite: require(`@/assets/checkbox-${theme}/zone-supply-site-checkbox.png`), // 区级保供场所
    };

  const {
    query: { iframe },
  } = useRouter();

  const [isVisible, setVisible] = useState(false);
  const [enableValue, setEnableValue] = useState([]);
  const [value, setValue] = useState([]);

  const options = data.map((i) => {
    return {
      label: (
        <span style={{ display: 'flex' }}>
          {relation[i.icon] ? <img className={styles.icon} src={relation[i.icon]} alt='icon' /> : ''}
          <span className={styles.label}>{i.label}</span>
        </span>
      ),
      value: i.value,
    };
  });

  const getOptions = (checkList) => {
    const res = checkList.map((i) => {
      return {
        // ...i,
        label: (
          <span style={{ display: 'flex' }}>
            {relation[i.icon] ? <img className={styles.icon} src={relation[i.icon]} alt='icon' /> : ''}
            <span className={styles.label}>{i.label}</span>
          </span>
        ),
        value: i.value
      };
    })
    return res
  };

  const onChange = (checkedValues) => {
    setCheckBoxValue(checkedValues);
    setValue(checkedValues)
  };

  const selectConfig = () => {
    setVisible(!isVisible);
  };

  const configCheckListFunc = (checkedValues) => {
    setEnableValue(checkedValues)
    const checkList = allList.filter((item) => checkedValues.includes(item.value));
    const nowAddValue = difference(checkedValues, enableValue)
    const nowDelValue = difference(enableValue, checkedValues)
    configCheckList && configCheckList(checkList, value, nowAddValue, nowDelValue);
  };

  useEffect(() => {
    setValue(defaultValue)
   }, [defaultValue])
   
   useEffect(() => {
    setEnableValue(Array.from(data, (item) => item.value))
   }, [data])

  return (
    <div className={styles.checkbox}>
      {isVisible ? (
        <div className={styles['checkbox-extend']} style={{ width: !iframe ? 782 : 380 }} >
          <div className={styles['checkbox-extend-head']}>
            <div className={styles['checkbox-extend-title']}>图层配置-勾选需要在图例区域展示的图层类别</div>
            <div className={styles['checkbox-extend-close']} onClick={selectConfig}></div>
          </div>
          <div className={styles['checkbox-extend-content']}>
            <Checkbox.Group
              options={getOptions(allList)}
              defaultValue={Array.from(allList, (item) => item.value)}
              value={enableValue}
              onChange={configCheckListFunc}
            />
          </div>
        </div>
      ) : null
      }
      <div className={styles['checkbox-wrapper']}>
        <div
          style={{
            maxWidth: isConfig ? 600 : 680,
          }}
        >
          <Checkbox.Group options={getOptions(data)} defaultValue={defaultCheckList} value={value} onChange={onChange} />
        </div>
        {isConfig ? <div className={styles['checkbox-config']} onClick={selectConfig}></div> : null}
      </div>
    </div >
  );
};

export default CheckBox;
