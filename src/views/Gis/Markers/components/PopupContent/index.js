/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { Table, Tooltip, Spin,Image } from '@jd/find-react';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import videojs from 'video.js';
// import 'video.js/dist/video-js.css';
import VideoJS from '../VideoJS';
import { useStore } from '@/hooks';
import EllipsisSpan from '../EllipsisSpan';
import TruckList from '@/components/TruckList';
import Player from '../Player';
import styles from './index.module.less';

let title;
const PopupContent = ({ showMore }) => {
  const { activeMarkerInfo = {}, setActiveMarkerInfo,theme } = useStore('gis');
  const { carFromOutProvince } = useStore('carOut');
  const { destinationSupplyList } = useStore('carIn');

  const { popupType, businessType, videoUrl } = activeMarkerInfo;
  // console.log(activeMarkerInfo, 'activeMarkerInfo');
  const { siteDetails, orderQuantity } = useStore('site');
  const [url, setUrl] = useState();
  const [detail, setDetail] = useState([]);
  const wrongString = ['null','none','undefined','']
  const colorRelation = {
    封控区: 'red',
    管控区: 'yellow',
    // 防范区: 'blue',
    // 临时管控区: 'purple',
  };
  const { markerId } = activeMarkerInfo;
  const fetchData = async () => {
    if (popupType === 1) {
      // 订单数量
      const indentNum = await orderQuantity({
        latitude: activeMarkerInfo.latitude,
        longitude: activeMarkerInfo.longitude,
      });

      title = '场所详情';
      const resData = [
        { key: '场所名称', value: activeMarkerInfo.businessName || '-' },
        { key: '所在区域', value: activeMarkerInfo.area || '-' },
        { key: '详细地址', value: activeMarkerInfo.address || '-' },
        {
          key: '场所性质',
          value: activeMarkerInfo.markerType || '-',
        },
        { key: '负责人', value: activeMarkerInfo.contacts || '-' },
        { key: '管理企业', value: activeMarkerInfo.manageBussiness || '-' },
        { key: '联系方式', value: activeMarkerInfo.contactNumber || '-' },
        { key: '面积', value: activeMarkerInfo.built_up_area || '-' },
        { key: '存储货物', value: activeMarkerInfo.category || '-' },
        { key: '配送人员数量', value: `${activeMarkerInfo.numberStaffIstribution}` || '-' },
        { key: '工人数量', value: `${activeMarkerInfo.numberStaff}` || '-' },
        { key: '订单数', value: activeMarkerInfo.type === '前置仓' ? `${indentNum || 0}` || '-' : 'null' },
        {
          key: '蔬菜日进货量',
          value:
            activeMarkerInfo.type === '超市门店' && !activeMarkerInfo.dataSource === '封控区保供'
              ? `${activeMarkerInfo.purchaseNum}` !== 'null'
                ? `${activeMarkerInfo.purchaseNum}（公斤）`
                : '-'
              : 'null',
        },
        {
          key: '蔬菜日销售量',
          value:
            activeMarkerInfo.type === '超市门店' && !activeMarkerInfo.dataSource === '封控区保供'
              ? `${activeMarkerInfo.saleNum}` !== 'null'
                ? `${activeMarkerInfo.saleNum}（公斤）`
                : '-'
              : 'null',
        },
      ];
      if (
        activeMarkerInfo.dataSource === '封控区保供' &&
        (activeMarkerInfo.type === '前置仓' || activeMarkerInfo.type === '超市门店')
      ) {
        const arr = [
          {
            key: '店状态',
            value:
              activeMarkerInfo.storesState && activeMarkerInfo.storesState !== 'null'
                ? `${activeMarkerInfo.storesState}`
                : '-',
          },
          {
            key: '闭店时间',
            value:
              activeMarkerInfo.closeStoreTime && activeMarkerInfo.closeStoreTime !== 'null'
                ? `${activeMarkerInfo.closeStoreTime}`
                : '-',
          },
          {
            key: '闭店原因',
            value:
              activeMarkerInfo.closeStoreReason && activeMarkerInfo.closeStoreReason !== 'null'
                ? `${activeMarkerInfo.closeStoreReason}`
                : '-',
          },
          {
            key: '蔬菜日进货量',
            value:
              activeMarkerInfo.purchaseNum && activeMarkerInfo.purchaseNum !== 'null'
                ? `${activeMarkerInfo.purchaseNum}`
                : '-',
          },
          {
            key: '蔬菜日销售量',
            value:
              activeMarkerInfo.saleNum && activeMarkerInfo.saleNum !== 'null' ? `${activeMarkerInfo.saleNum}` : '-',
          },
          {
            key: '门蔬菜日库存量',
            value:
              activeMarkerInfo.inventoryNum && activeMarkerInfo.inventoryNum !== 'null'
                ? `${activeMarkerInfo.inventoryNum}`
                : '-',
          },
        ];
        setDetail(resData.concat(arr));
        // console.log(activeMarkerInfo, '1122');
        // console.log(resData.concat(arr), '1122233');
      } else {
        setDetail(resData);
      }
    } else if (popupType === 2) {
      title = '企业详情';
      const resData = [
        { key: '企业名称', value: activeMarkerInfo.companyName || '-' },
        { key: '详细地址', value: activeMarkerInfo.detailedAddress || '-' },
        { key: '从业人员', value: `${activeMarkerInfo.crowdAmount}` || '-' },
        { key: '核酸检验阳性比例', value: `${activeMarkerInfo.nucleicAcidRatioDay}` || '-' },
        { key: '检测周期', value: `${activeMarkerInfo.period}` || '-' },
        { key: '统计时间', value: activeMarkerInfo.gatherTime || '-' },
      ];
      // console.log(detail, 'detail');
      setDetail(resData);
    } else if (popupType === 4) {
      title = activeMarkerInfo.liveName;
      const resData = [
        { key: `${activeMarkerInfo.type}开始时间`, value: activeMarkerInfo.sealingStartDate || '-' },
        { key: '管控户数', value: `${activeMarkerInfo.householdNum || '-'}户` },
        { key: '管控人数', value: `${activeMarkerInfo.peopleNum || '-'}人` },
        {
          key: '蔬菜每日消耗量',
          value: (!!activeMarkerInfo.vegetableCount && `${activeMarkerInfo.vegetableCount}公斤`) || '-',
        },
        {
          key: '猪肉每日消耗量',
          value: (!!activeMarkerInfo.porkCount && `${activeMarkerInfo.porkCount}公斤`) || '-',
        },
        {
          key: '鸡蛋每日消耗量',
          value: (!!activeMarkerInfo.eggCount && `${activeMarkerInfo.eggCount}公斤`) || '-',
        },
        {
          key: '牛奶每日消耗量',
          value: (!!activeMarkerInfo.milkCount && `${activeMarkerInfo.milkCount}L`) || '-',
        },
      ];
      setDetail(resData);
      // console.log(activeMarkerInfo, 'activeMarkerInfo--');
      // const timeArray = activeMarkerInfo?.sealingDate?.split(' ')[0].split('-');
    } else if (popupType === 5) {
      title = '企业详情';

      const resData = [
        { key: '企业名称', value: activeMarkerInfo.businessName || '-' },
        {
          key: '白名单人数',
          value: (!!activeMarkerInfo.businessCount && !wrongString.includes(activeMarkerInfo.businessCount) && `${activeMarkerInfo.businessCount}人`) || '-',
        },
        // { key: '企业联系人', value: activeMarkerInfo.contacts || '-' },
        // { key: '企业联系方式', value: activeMarkerInfo.contactNumber || '-' },
        // { key: '员工姓名', value: activeMarkerInfo.staffName || '-' },
        // { key: '身份证号码', value: `${activeMarkerInfo.pid}` || '-' },
        // { key: '手机号码', value: `${activeMarkerInfo.phone}` || '-' },
        // { key: '人员类型', value: activeMarkerInfo.staffType || '-' },
        { key: '所在行政区', value: activeMarkerInfo.area || '-' },
        { key: '详细地址', value: activeMarkerInfo.address || '-' },
        { key: '服务涉及区域', value: activeMarkerInfo.serviceArea || '-' },
        // { key: '状态', value: activeMarkerInfo.type || '-' },
      ];
      setDetail(resData);
    } else if (popupType === 6) {
      // 管控圈，面数据
      title = activeMarkerInfo.liveName;
      const resData = [
        { key: '基础信息', value: 'label' },
        { key: '管控开始时间', value: activeMarkerInfo.sealingStartDate || '-' },
        { key: '管控户数', value: `${activeMarkerInfo.householdNum || '-'}户` },
        { key: '管控人数', value: `${activeMarkerInfo.peopleNum || '-'}人` },
        { key: '管控圈保供点数量', value: (!!activeMarkerInfo.spotNum && `${activeMarkerInfo.spotNum}个`) || '-' },
        { key: '居民需求', value: 'label' },
        {
          key: '管控范围物资储备',
          value: (!!activeMarkerInfo.reserveum && `${activeMarkerInfo.reserveum}吨`) || '-',
        },
        {
          key: '蔬菜每日消耗量',
          value: (!!activeMarkerInfo.vegetableCount && `${activeMarkerInfo.vegetableCount}公斤`) || '-',
        },
        {
          key: '猪肉每日消耗量',
          value: (!!activeMarkerInfo.porkCount && `${activeMarkerInfo.porkCount}公斤`) || '-',
        },
        {
          key: '鸡蛋每日消耗量',
          value: (!!activeMarkerInfo.eggCount && `${activeMarkerInfo.eggCount}公斤`) || '-',
        },
        {
          key: '牛奶每日消耗量',
          value: (!!activeMarkerInfo.milkCount && `${activeMarkerInfo.milkCount}L`) || '-',
        },
        { key: '配送人员', value: 'label' },
        {
          key: '管控范围配送人员数量',
          value: (!!activeMarkerInfo.giveNum && `${activeMarkerInfo.giveNum}人`) || '-',
        },
        {
          key: '管控范围配送人员需求数量',
          value: (!!activeMarkerInfo.demandNum && `${activeMarkerInfo.demandNum}人`) || '-',
        },
      ];
      setDetail(resData);
    } else if (popupType * 1 === 7) {
      const resData = [
        { key: '所在区', value: activeMarkerInfo.area || '-' },
        { key: '门店名称', value: activeMarkerInfo.shopName || '-' },
        { key: '关闭时间', value: activeMarkerInfo.closeDate || '-' },
        { key: '通知关店机构', value: `${activeMarkerInfo.noticeOrg || '-'}` },
        { key: '闭店原因', value: activeMarkerInfo.closeCause || '-' },
        { key: '恢复营业前采取措施', value: activeMarkerInfo.useMethod || '-' },
      ];
      setDetail(resData);
    } else if (popupType === 8) {
      title = '蔬菜直通车详情';
      const resData = [
        { key: '保障点', value: activeMarkerInfo.communityName || '-' },
        { key: '企业名称', value: activeMarkerInfo.companyName || '-' },
        { key: '直通车总数', value: activeMarkerInfo.directCarCount || '-' },
        { key: '司机名称', value: activeMarkerInfo.driverName || '-' },
        { key: '车牌号', value: activeMarkerInfo.carPlate || '-' },
        { key: '品类', value: activeMarkerInfo.goodsType || '-' },
        { key: '数量', value: activeMarkerInfo.goodsWeight || '-' },
      ];
      setDetail(resData);
    } else if (popupType === 9) {
      title = '临时通行证企业详情';
      const resData = [
        { key: '企业名称', value: activeMarkerInfo.accountName || '-' },
        { key: '所在区域', value: activeMarkerInfo.accountArea || '-' },
        { key: '详细地址', value: activeMarkerInfo.address || '-' },
        { key: '临时通行证数量', value: `${activeMarkerInfo.permitNum}` || '-' },
      ];
      setDetail(resData);
    } else if (popupType === 10) {
      title = '场所详情';
      const resData = [
        { key: '企业名称', value: activeMarkerInfo.businessName || '-' },
        { key: '所在区域', value: activeMarkerInfo.area || '-' },
        { key: '所属街道', value: activeMarkerInfo.street || '-' },
        { key: '详细地址', value: activeMarkerInfo.address || '-' },
        { key: '场所性质', value: activeMarkerInfo.businessType || '-' },
        { key: '联系人', value: activeMarkerInfo.contacts || '-' },
        { key: '联系方式', value: activeMarkerInfo.telephone || '-' },
      ];
      setDetail(resData);
    } else if (popupType === 11) {
      title = '缺货报警信息';
      const { businessName,stapleReplenishment,subsidiaryReplenishment,vegetableReplenishment,fruitReplenishment } = activeMarkerInfo
      const resData = [
        { key: '名称', value: 
        (!!businessName && !wrongString.includes(businessName) && `${businessName}` || '-') },
        { key: '主食缺口', value:
        (!!stapleReplenishment && !wrongString.includes(stapleReplenishment) && `${stapleReplenishment}公斤` || '-') },
        { key: '副食缺口', value: 
        (!!subsidiaryReplenishment && !wrongString.includes(subsidiaryReplenishment) && `${subsidiaryReplenishment}公斤` || '-') },
        { key: '蔬菜缺口', value: 
        (!!vegetableReplenishment && !wrongString.includes(vegetableReplenishment) && `${vegetableReplenishment}公斤` || '-') },
        { key: '水果缺口', value:  
        (!!fruitReplenishment && !wrongString.includes(fruitReplenishment) && `${fruitReplenishment}公斤` || '-') },
      ];
      setDetail(resData);
    }
  };

  // 重新设置详情弹框的值
  const setDetailList = async (data) => {
    // 订单数量
    const indentNum = await orderQuantity({
      latitude: activeMarkerInfo.latitude,
      longitude: activeMarkerInfo.longitude,
    });
    const resData = [
      { key: '场所名称', value: data.businessName || '-' },
      { key: '所在区域', value: data.area || '-' },
      { key: '详细地址', value: data.address || '-' },
      {
        key: '场所性质',
        value: data.markerType || '-',
      },
      { key: '负责人', value: data.contacts || '-' },
      { key: '管理企业', value: data.manageBussiness || '-' },
      { key: '联系方式', value: data.contactNumber || '-' },
      { key: '面积', value: data.built_up_area || '-' },
      { key: '存储货物', value: data.category || '-' },
      { key: '配送人员数量', value: `${data.numberStaffIstribution}` || '-' },
      // { key: '订单数', value: data.type === '前置仓' || data.type === '批发市场' ? `${data.orderNum || indentNum || 0}` || '-' : 'null' },
      { key: '订单数', value: data.orderNum || indentNum ? `${data.orderNum || indentNum || 0}` || '-' : 'null' },
      { key: '工人数量', value: `${data.numberStaff}` || '-' },
      {
        key: '店状态',
        value: data.storesState && data.storesState !== 'null' ? `${data.storesState}` : '-',
      },
      {
        key: '闭店时间',
        value: data.closeStoreTime && data.closeStoreTime !== 'null' ? `${data.closeStoreTime}` : '-',
      },
      {
        key: '闭店原因',
        value: data.closeStoreReason && data.closeStoreReason !== 'null' ? `${data.closeStoreReason}` : '-',
      },
      {
        key: '蔬菜日进货量',
        value: data.purchaseNum && data.purchaseNum !== 'null' ? `${data.purchaseNum}` : '-',
      },
      {
        key: '蔬菜日销售量',
        value: data.saleNum && data.saleNum !== 'null' ? `${data.saleNum}` : '-',
      },
      {
        key: '门蔬菜日库存量',
        value: data.inventoryNum && data.inventoryNum !== 'null' ? `${data.inventoryNum}` : '-',
      },
    ];
    setDetail(resData);
  };

  useEffect(() => {
    if (popupType === 1) {
      siteDetails(activeMarkerInfo.id).then((res) => {
        setUrl(res.pictureDetails);

        const siteType = {
          1: '批发市场',
          6: '电商大仓',
          2: '连锁超市',
          5: '前置仓',
          4: '社区菜市场',
          3: '直营直供',
          7: '超市门店',
          8: '蔬菜直通车',
        };
        if (activeMarkerInfo.dataSource === '封控区保供') {
          setDetailList({
            ...res,
            markerId: res?.id,
            lng: res?.longitude,
            lat: res?.latitude,
            type: res?.typeName || siteType[res?.businessType],
            num: '',
            popupType: 1,
          });
        }
      });
    }
    fetchData();
  }, [activeMarkerInfo.lng]);

  // const dateLabel = [' 年 ', ' 月 ', ' 日 '];
  const truckColumns = [
    {
      title: '车牌号',
      dataIndex: 'carPlate',
      key: 'carPlate',
      width: 46,
      ellipsis: true,
    },
    {
      title: '司机姓名',
      dataIndex: 'driverName',
      key: 'driverName',
      align: 'center',
      width: 64,
      ellipsis: true,
    },
    {
      title: '联系电话',
      dataIndex: 'driverPhone',
      key: 'driverPhone',
      align: 'center',
      width: 81,
      ellipsis: true,
    },
    {
      title: '冷链车',
      dataIndex: 'coldChain',
      key: 'coldChain',
      align: 'center',
      width: 48,
    },
    {
      title: '品类',
      dataIndex: 'goodsType',
      key: 'goodsType',
      width: 40,
      ellipsis: true,
      render: (text, item) => {
        const goodsType = item?.goodsInfoEntities.map((d) => d.goodsType).join(', ');
        return <span>{goodsType}</span>;
      },
    },
    {
      title: '数量（吨）',
      dataIndex: 'goodsWeight',
      key: 'goodsWeight',
      align: 'right',
      width: 40,
      ellipsis: true,
      render: (text, item) => {
        let count = 0;
        item?.goodsInfoEntities.forEach((d) => {
          count += d?.goodsWeight;
        });
        return <span>{count}</span>;
      },
    },
  ];
  const handleClick = () => {
    showMore && showMore(activeMarkerInfo);
  };

  const closePopup = () => {
    document.getElementsByClassName('mapboxgl-popup-close-button')[1].dispatchEvent(new MouseEvent('click', { bubbles: true }))
  }

  const context = require.context('@/assets/images',true,/.png$/)
  const wrongImg = context(`./${theme}/wrong-img.png`)
  return (
    <>
      {(popupType === 1 || popupType === 5 || popupType === 9 || popupType === 10  || popupType === 11) && (
        <div className={styles['site-popup-wrapper']}>
          <div className={styles['site-header-area']}>
            <div className={styles.header}>{title}</div>
            <div
              className={
                popupType === 5 || popupType === 9 || popupType === 11 || businessType === 5
                  ? styles['not-show-more']
                  : styles['site-show-more']
              }
              onClick={handleClick}
            >
              更多
            </div>
          </div>
          <div className={styles['site-content-area']}>
            {(popupType === 1) && (
              <div className={styles['img-wrapper']}>
                {url ? <Image width={207} height={117} src={url} fallback={wrongImg} /> : <Spin />}
                {/* {url ? <img src={url || 'https://bxp.sw.beijing.gov.cn/tupian//npsc0502/gxys/XFDSC.jpg'} alt='图片' style={{ width: '207px', height: '117px' }} /> : <Spin />} */}
              </div>
            )}
            {(popupType === 5 || popupType === 9 || popupType === 10) && (
              <div style={{ height: '15px', width: '100%' }}></div>
            )}
            <div className={styles['content-wrapper']}>
              {detail.map((i, idx) => {
                if (i.value && i.value !== 'null' && i.value !== 'undefined') {
                  return (
                    <div className={styles['item-wrapper']} key={`${idx}${i}`}>
                      <div className={styles['detail-name']}>{i.key}</div>
                      <div className={styles['split-line']}>|</div>
                      <div className={styles['detail-value']}>
                        <EllipsisSpan title={i.value} limit={12} />
                      </div>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        </div>
      )}
      {popupType === 2 && (
        <div className={styles['staff-popup-wrapper']}>
          <div className={styles.header}>{title}</div>
          <div className={styles['content-wrapper']} style={{ marginTop: '16px' }}>
            {detail.map((i, idx) => {
              if (i.value && i.value !== 'null' && i.value !== 'undefined') {
                return (
                  <div className={styles['item-wrapper']} key={`${idx}${i}`} style={{ margin: '4px 0' }}>
                    <div className={styles['detail-name']}>{i.key}</div>
                    <div className={styles['split-line']}>|</div>
                    <div className={styles['detail-value']}>
                      <EllipsisSpan title={i.value} limit={10} />
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      )}
      {popupType === 3 && (
        <div>
          <TruckList
            columns={truckColumns}
            dataSource={destinationSupplyList}
            rowKey='id'
            style={{
              width: 'max-content',
              maxWidth: 500,
              height: 400,
            }}
            options={{
              title: `${activeMarkerInfo?.receiveCompany}目的地货车清单`,
              canClose: true,
            }}
            closeTable={() => {
              setActiveMarkerInfo();
            }}
            showMore={showMore}
          />
        </div>
      )}
      {(popupType === 4 || popupType === 6) && (
        <div
          className={`${styles['area-popup-wrapper']} ${
            styles[`pop-area-${colorRelation[activeMarkerInfo.sealingType]}`]
          }`}
        >
          <div className={styles.header} style={{ marginTop: videoUrl && videoUrl !== 'null' ? '122px' : '59px' }}>
            {title}
          </div>
          <button 
          className='mapboxgl-popup-close-button'
           type='button'
            aria-label='Close popup' 
            onClick={closePopup}
            style={{ marginTop: videoUrl && videoUrl !== 'null' ? '122px' : '59px',marginRight: '15px' }}
            >
            ×
          </button>
          <div className={styles['split-line']}></div>
          {videoUrl && videoUrl !== 'null' && <Player url={videoUrl} />}
          <div className={styles['area-content-wrapper']}>
            {detail.map((i, idx) => {
              if (i.value && i.value !== 'null' && i.value !== '-' && i.value !== 'undefined') {
                return (
                  <div
                    className={styles['item-wrapper']}
                    key={`${idx}${i}`}
                    style={{ margin: '4px 0', width: i.value === 'label' ? '540px' : '270px' }}
                  >
                    <div className={styles['detail-name']}>{i.key}</div>
                    {i.value !== 'label' ? (
                      <>
                        <div className={styles['split-line2']}>|</div>
                        <div className={styles['detail-value']}>
                          <EllipsisSpan title={i.value} limit={10} />
                        </div>
                      </>
                    ) : (
                      ''
                    )}
                  </div>
                );
              }
              return null;
            })}
            {/* <div className={styles['area-detail-name']}>{activeMarkerInfo.type}开始时间</div>
            <div className={styles['area-detail-value']}>{activeMarkerInfo.sealingStartDate || '-'}</div> */}
          </div>
        </div>
      )}
      {(popupType * 1 === 7 || popupType * 1 === 8) && (
        <div className={styles['staff-popup-wrapper']}>
          <div className={styles.header}>{title}</div>
          <div className={styles['content-wrapper']} style={{ marginTop: '16px' }}>
            {detail.map((i, idx) => {
              if (i.value && i.value !== 'null' && i.value !== 'undefined') {
                return (
                  <div className={styles['item-wrapper']} key={`${idx}${i}`} style={{ margin: '4px 0' }}>
                    <div className={styles['detail-name']}>{i.key}</div>
                    <div className={styles['split-line']}>|</div>
                    <div className={styles['detail-value']}>
                      <EllipsisSpan title={i.value} limit={10} />
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default observer(PopupContent);
