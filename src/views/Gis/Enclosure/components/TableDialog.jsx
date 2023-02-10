/* eslint-disable */
import { useState, useEffect } from 'react';
import { Image } from '@jd/find-react';
// import { toJS } from 'mobx';
import { useFetchData, useStore } from '@/hooks';
import EllipsisSpan from '@/views/Gis/Markers/components/EllipsisSpan';
import * as api from '@/api/gisOther';
import styles from '../Enclosure.module.less';

function TableDialog({ item, handleClose }) {
  // console.log('TableDialog22222222222222', item);
  const { siteDetails, orderQuantity } = useStore('site');
  const { theme } = useStore('gis');
  const [url, setUrl] = useState();
  const [indentNum, setIndentNum] = useState('');
  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState([]);

  const getData = (data) => {
    // console.log('TbDialog', data);
    let title = '';
    let detail = [];
    if (data?.type === '超市门店' || data?.type === '前置仓') {
      title = '场所详情';
      detail = [
        { key: '场所名称：', value: data.businessName || '-' },
        { key: '所在区域：', value: data.area || '-' },
        { key: '详细地址：', value: data.address || '-' },
        { key: '场所性质：', value: data.markerType || '-' },
        { key: '负责人：', value: data.contacts || '-' },
        { key: '管理企业：', value: data.manageBussiness || '-' },
        { key: '联系方式：', value: data.contactNumber || '-' },
        { key: '面积：', value: data.built_up_area || '-' },
        { key: '存储货物：', value: data.category || '-' },

        { key: '配送人员数据', value: data.numberStaffIstribution || '-' },
        { key: '工人数量', value: data.numberStaff || '-' },
        {
          key: '蔬菜日进货量:',
          value: data?.purchaseNum && data?.purchaseNum !== 'null' ? `${data.purchaseNum}公斤` : '-',
        },
        { key: '蔬菜日销售量:', value: data?.saleNum && data?.saleNum !== 'null' ? `${data.saleNum}公斤` : '-' },
        {
          key: '门蔬菜日库存量:',
          value: data?.inventoryNum && data?.inventoryNum !== 'null' ? `${data.inventoryNum}公斤` : '-',
        },
        { key: '门店状态', value: data.storesState || '-' },
        { key: '闭店时间', value: data.closeStoreTime || '-' },
        { key: '闭店原因', value: data.closeStoreReason || '-' },
        // { key: '配送人员数量：', value: `${data.numberStaffIstribution}` || '-' },
        // { key: '工人数量：', value: `${data.numberStaff}` || '-' },
        // { key: '蔬菜日进货量:', value: data?.purchaseNum && data?.purchaseNum !== 'null' ? `${data.purchaseNum}公斤` : '-',},
        // { key: '蔬菜日销售量:', value: data?.saleNum && data?.saleNum !== 'null' ? `${data.saleNum}公斤` : '-', },
        // { key: '门蔬菜日库存量:', value: data?.inventoryNum && data?.inventoryNum !== 'null' ? `${data.inventoryNum}公斤`: '-', },
      ];
    } else if (
      data?.type === '场所' ||
      data?.type === '批发市场' ||
      data?.type === '连锁超市' ||
      data?.type === '直营直供' ||
      data?.type === '社区菜市场'
    ) {
      title = '场所详情';
      detail = [
        { key: '场所名称：', value: data.businessName || '-' },
        { key: '所在区域：', value: data.area || '-' },
        { key: '详细地址：', value: data.address || '-' },
        { key: '场所性质：', value: data.markerType || '-' },
        { key: '负责人：', value: data.contacts || '-' },
        { key: '管理企业：', value: data.manageBussiness || '-' },
        { key: '联系方式：', value: data.contactNumber || '-' },
        { key: '面积：', value: data.built_up_area || '-' },
        { key: '存储货物：', value: data.category || '-' },
        { key: '配送人员数量：', value: `${data.numberStaffIstribution}` || '-' },
        { key: '工人数量：', value: `${data.numberStaff}` || '-' },
      ];
    } else if (data?.type === '车辆2') {
      title = '车辆详情';
      detail = [
        { key: '目的场所：', value: data.receiveCompany || '-' },
        { key: '目的场所性质：', value: data.receiveCompanyType || '-' },
        { key: '目的场所行政区：', value: data.receiveArea || '-' },
        { key: '货源地：', value: data.goodsSourceAreaOut || '-' },
        { key: '车牌号：', value: data.carPlate || '-' },
        { key: '联系人：', value: data.driverName || '-' },
        { key: '联系方式：', value: data.driverPhone || '-' },
        { key: '是否冷链：', value: data.coldChain || '-' },
      ];
      // console.log(detail, 'detail');
    } else if (data?.type === '人员') {
      const className =
        data.status === '白名单'
          ? 'staff-status-1'
          : data.status === '弹窗'
          ? 'staff-status-2'
          : data.status === '居家隔离'
          ? 'staff-status-3'
          : 'staff-status-0';
      title = '人员详情';
      detail = [
        { key: '企业名称：', value: data.businessName || '-' },
        { key: '姓名：', value: data.staffName || '-' },
        { key: '联系方式：', value: data.staffNumber || '-' },
        { key: '人员类别：', value: data.staffType || '-' },
        { key: '所在行政区：', value: data.area || '-' },
        { key: '详细地址：', value: data.address || '-' },
        { key: '服务涉及区域：', value: data.service_area || '-' },
        { key: '状态：', value: data.status || '-', class: className },
      ];
      // console.log(detail, 'detail===++++==');
    } else if (data?.type === '蔬菜直通车' || data?.type === '车辆') {
      title = '蔬菜直通车详情';
      detail = [
        { key: '保障点：', value: data.communityName || '-' },
        { key: '企业名称：', value: data.companyName || '-' },
        { key: '直通车总数：', value: data.directCarCount || '-' },
        { key: '司机名称：', value: data.driverName || '-' },
        { key: '车牌号：', value: data.carPlate || '-' },
        { key: '品类：', value: data.goodsType || '-' },
        { key: '数量', value: data.goodsWeight || '-' },
      ];
    }

    setTitle(title);
    setDetail(detail);
  };
  const handleClick = () => {
    item.businessType && api.gotoShowMore(item);
  };
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
  useEffect(() => {
    // console.log('useEffect siteDetails', item)
    if (!item || !item.id) return;
    // console.log('useEffect siteDetails', item)
    if (
      (item?.type === '场所' ||
        item?.type === '批发市场' ||
        item?.type === '连锁超市' ||
        item?.type === '直营直供' ||
        item?.type === '社区菜市场' ||
        item?.type === '前置仓' ||
        item?.type === '超市门店') &&
      item
    ) {
      // console.log('siteDetails')
      siteDetails(item.id).then((res) => {
        setUrl(res.pictureDetails);
        getData({ ...item, ...res, type: res?.typeName || siteType[res.businessType] });
      });
    } else {
      getData(item);
    }
  }, []);
  useEffect(() => {
    // console.log('useEffect siteDetails31', item)
    const type = item?.typeName || siteType[item?.businessType] || '';
    // console.log('useEffect siteDetails3', item)

    if (
      (type === '场所' ||
        type === '批发市场' ||
        type === '连锁超市' ||
        type === '直营直供' ||
        type === '社区菜市场' ||
        type === '前置仓' ||
        type === '超市门店') &&
      item
    ) {
      // console.log('siteDetails')
      siteDetails(item.id).then((res) => {
        setUrl(res.pictureDetails);
        getData({ ...item, ...res, type: res?.typeName || siteType[res.businessType] });
      });
    } else {
      getData(item);
    }
    async function fetchData() {
      try {
        const res = await orderQuantity({
          latitude: item.latitude,
          longitude: item.longitude,
        });
        setIndentNum(res + '' || 0 + '');
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [item]);

  const context = require.context('@/assets/images', true, /.png$/);
  const wrongImg = context(`./${theme}/wrong-img.png`);
  return (
    <div className={styles['site-popup-wrapper']}>
      <div className={styles['site-header-area']}>
        <div className={styles.header}>
          {title}
          {item?.businessType ? (
            <div className={styles['site-show-more']} onClick={handleClick}>
              更多
            </div>
          ) : (
            ''
          )}
        </div>
        <div className={styles.toolbar}>
          <div className={styles['site-show-close']} onClick={() => handleClose && handleClose()}>
            X
          </div>
        </div>
      </div>
      <div className={styles['site-content-area']}>
        {url ? (
          <div className={styles['img-wrapper']}>
            <Image width={207} height={117} src={url} fallback={wrongImg} />
            {/* <img src={url} alt='图片' style={{ width: '207px', height: '117px' }} /> */}
          </div>
        ) : (
          ''
        )}

        <div className={styles['content-wrapper']}>
          {detail?.map((i, idx) => {
            if (i.value && i.value !== 'null' && i.value !== 'undefined') {
              return (
                <div className={styles['item-wrapper']} key={`${idx}${i}`}>
                  <div className={styles['detail-name']}>{i.key}</div>
                  <div className={`${styles['detail-value']} ${styles[i.class]}`}>
                    <EllipsisSpan title={i.value} limit={27} />
                  </div>
                </div>
              );
            }
            return null;
          })}
          <div className={styles['item-wrapper']}>
            <div className={styles['detail-name']}>订单数：</div>
            <div className={`${styles['detail-value']}`}>{indentNum}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default TableDialog;
