/* eslint-disable */
import React, { useEffect, createRef, useState } from 'react';
import { observer, inject } from 'mobx-react';
import { toJS } from 'mobx';
import { assign } from 'lodash';
import { Button, Progress, Modal } from '@jd/find-react';
import JdProgress from '@/components/Progress';
import TableList from '@/components/TableList';
import Search from '@/components/Search';
import ImageTab from '@/components/ImageTab';
import CheckBox from '@/components/CheckBox';
import TableTab from '@/components/TableTab';
import { SearchPage } from '@/lcdp';
import Markers from '@/components/GisMap';
import { checkList, checkItenList } from './config';
import { OA_ENCRY } from '@/config';
import moment from 'moment';
import { useStore, useRouter } from '@/hooks';
import Card from '@/components/Card';
import styles from './index.module.less';
import { StreamReadUsage } from 'three';
import { CaretDownOutlined } from '@ant-design/icons';
import * as api from '@/api/gisOther';
function User({ gis }) {
  const store = useStore('crew');
   const { siteDetails } = useStore('site');
  const {
    query: { iframe },
  } = useRouter();
  // 聚合地图
  const [zoom, setZoom] = useState(9);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisible1, setIsModalVisible1] = useState(false);
  // 回到中心点
  const [updateCenter, setUpdateCenter] = useState(null);
  const [checkboxDefaultValue, setCheckboxDefaultValue] = useState(['正常']);
  const [showLeft, setShowLeft] = useState(true);
  const [showRight, setShowRight] = useState(true);
  const [area, setArea] = useState(sessionStorage.getItem('area'));
  const { setCurRegion, theme, checkboxStatus, setCheckboxStatus, activeMarkerInfo, setActiveMarkerInfo } = gis;
  // const dataList = [
  //   {
  //     title: '企业总数',
  //     num: store?.coldChainList?.companySum,
  //     unit: '家',
  //   },
  //   {
  //     title: '从业人员总数',
  //     num: store?.coldChainList?.crowdAmountSum,
  //     unit: '人',
  //   },
  //   {
  //     title: '核酸检测人员比例',
  //     num: store?.coldChainList?.administrativeRegion,
  //     unit: '%',
  //   },
  // ];

  // const dataList = [
  //   {
  //     title: '白名单',
  //     num: store?.coldChainList?.companySum,
  //     unit: '人',
  //   },
  //   {
  //     title: '弹框',
  //     num: store?.coldChainList?.crowdAmountSum,
  //     unit: '人',
  //   },
  //   {
  //     title: '居家隔离',
  //     num: store?.coldChainList?.administrativeRegion,
  //     unit: '人',
  //   },
  // ];

  // const imageTabOption = {
  //   tabTitle: 'TOP6企业图片',
  //   hasHead: true,
  //   imageList: store?.imgList,
  // };
  const { outOaURL } = window.GLOBAL_CONFIG;

  const columns = [
    {
      title: '行政区',
      dataIndex: 'area',
      key: 'area',
    },
    {
      title: '企业数量',
      dataIndex: 'companySum',
      key: 'companySum',
      render: (text) => (
        <div>
          <span className={styles.mr_r}>{text}</span>
          {typeof text === 'number' && (
            <JdProgress
              percent={(text / store?.screenList?.personnelMaxVO?.companySumMax) * 100}
              steps={20}
              size='small'
              showInfo={false}
              theme={theme}
            />
          )}
        </div>
      ),
    },
    {
      title: '从业人员数量',
      dataIndex: 'staffCount',
      key: 'staffCount',
      render: (text) => (
        <div>
          <span className={styles.mr_r}>{text}</span>
          {typeof text === 'number' && (
            <JdProgress
              percent={(text / store?.screenList?.personnelMaxVO.staffCountMax) * 100}
              steps={20}
              size='small'
              showInfo={false}
              strokeBgColor='#52c41a'
            />
          )}
        </div>
      ),
    },
  ];
  const surveyColumns = [
    {
      title: '人员类别',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '人员数量（人）',
      dataIndex: 'count',
      key: 'count',
    },
  ];

  // 搜索框回车事件
  const onSearch = ({ businessName }) => {
    store.screen('search', { ...store.paramsObj, address: businessName });
  };

  // 复选框事件
  const changeCheck = (value) => {
    setCheckboxDefaultValue(value);
    store.screen('check', {
      ...store.paramsObj,
      area: gis.curRegion,
      companyName: value,
    });
  };

  // 下拉选事件
  const selectItem = async (item) => {
    setCurRegion(item.area);
    setArea(item.area);
    await store.querySealingSealingTypeList({ area: item.area });
    await store.queryStaff({ area: item.area });
    await store.queryState({ area: item.area });
    await store.screen('check', {
      ...store.paramsObj,
      area: item.area,
      companyName: checkboxDefaultValue,
    });
    getWhiteList({ area: item.area });
  };

  // 点击左侧列表头部’北京‘清除地图画圈回到中心点
  const cilckTitle = async () => {
    setCurRegion('北京');
    setArea('');
    await store.querySealingSealingTypeList({ area: '' });
    await store.queryStaff({ area: '' });
    await store.queryState({ area: '' });
    await store.screen('search', {
      address: '',
      area: '',
      companyName: ['正常'],
    });
    setZoom(8);
    setUpdateCenter(new Date().getTime());
    getWhiteList();
  };

  // 地图Marker点击回调
  const handleMarkerClick = async (item) => {
    const marker = {};
    const siteType = ['企业白名单','封控区','管控区']
    if (item && !siteType.includes(item.type)  ) {
      const res = await siteDetails(item.id);
      assign(marker, item, {
        url: res?.pictureDetails,
        ...res,
        showMore: function () {
          api.gotoShowMore(this);
        },
      });
    }
    setActiveMarkerInfo(marker);
  };
  
  // 显示保供白名单弹出窗
  const showSupplyModal =
    ({ type = '' }) =>
    async () => {
      if (type === '保供白名单人员') {
        // const {GLOBAL_CONFIG:{ outOaURL } } = window;
        // console.log(process.env.REACT_APP_BUILD_ENV);
        // console.log('url',`${outOaURL}${process.env.REACT_APP_BUILD_ENV === 'production' ? '/': '/jczl'}/swj-whitelist/#/statistic?from=gis&token=${store.accessTokenForOa}`);
        // await store.getAccessTokenForScreenApi(OA_ENCRY)

        setIsModalVisible1(true);
        // alert("点击弹出白名单人员统计表")
      }
    };

  const getWhiteList = async ({ area = '北京' } = {}) => {
    await store.getWhiteListForScreenApi({ area });
  };

  // 地图图例图标点击回调
  const changeLegend = (value) => {
    setCheckboxStatus(value);
  };

  const positionIcon = !iframe ? (showRight ? 386 : 22) : '760px';
  const scaleRight = !iframe ? (showRight ? '23%' : '4%') : '760px';

  // 初始话加载数据
  useEffect(() => {
    store.getAdministrative({ area: gis.curRegion === '北京' ? '' : gis.curRegion });
    store.screen('', { area: gis.curRegion === '北京' ? '' : gis.curRegion , companyName:checkboxDefaultValue});
    // store.coldChain();
    store.querySealingSealingTypeList({ area: gis.curRegion === '北京' ? '' : gis.curRegion });
    // store.querySupportImgMappingList({ type: 1 });
    store.queryStaff({ area: gis.curRegion === '北京' ? '' : gis.curRegion });
    store.queryState({ area: gis.curRegion === '北京' ? '' : gis.curRegion });

    store.getAccessTokenForScreenApi(OA_ENCRY).then(() => {
      getWhiteList({ area: gis.curRegion === '北京' ? '' : gis.curRegion });
    }); // 获取白名单-京办的token
  }, [gis.curRegion]);

  useEffect(() => {
    store.getCheckBoxData(
      {
        parentCode: 'DICT_REGIONTYPE',
      },
      checkList,
      checkItenList,
    );

    // 重置参数
    return () => {
      setCurRegion(sessionStorage.getItem('area'));
      setCheckboxStatus(false);
    };
  }, []);

  const leftBtn = require(`@/assets/images/${theme}/left_normal.png`);
  const leftBtnActive = require(`@/assets/images/${theme}/left_active.png`);
  const rightBtn = require(`@/assets/images/${theme}/right_normal.png`);
  const rightBtnActive = require(`@/assets/images/${theme}/right_active.png`);

  return (
    <div className={styles.user_wrap}>
      <Markers
        markerData={toJS(store.gisData.markerData)}
        changeLegend={changeLegend}
        activeArea={gis?.curRegion}
        toolConfig={{ show: true, right: positionIcon }}
        scaleConfig={{ status: true, bottom: '25px', right: scaleRight }}
        activeMarker={activeMarkerInfo}
        handleMarkerClick={handleMarkerClick}
        // zoomToolConfig={{ status: true, bottom: '20px', right: positionIcon }}
        // originToolConfig={{ status: true, bottom: '95px', right: positionIcon }}
        // dimensionToolConfig={{ status: true, bottom: '131px', right: positionIcon }}
        // themeToolConfig={{ status: true, bottom: '203px', right: positionIcon }}
        // checkboxToolConfig={{status: true, bottom: '167px', right: positionIcon}}
        // data={toJS(store.gisData)}
        // zoom={zoom}
        // minZoom={4}
        // updateCenter={updateCenter}
        // onClickMarker={onClickMarker}
      />

      {checkboxStatus && (
        <div className={styles.check_box}>
          <CheckBox
            defaultValue={checkboxDefaultValue}
            data={store?.checkList}
            setCheckBoxValue={changeCheck}
            theme={theme}
          />
        </div>
      )}

      <div className={`${styles.left}  ${iframe ? styles.mobileP : ''}`}>
        <div className={`${styles.com_padding} ${showLeft ? styles.show : styles.hidden}`}>
          {/* <TableList
          style={{ width: 352 }}
          title='各行政区数量统计'
          columns={columns}
          dataSource={store?.screenList?.administrativeRegionVOList || []}
          onClick={selectItem}
          cilckTitle={cilckTitle}
        /> */}
          <div className={styles.table_list}>
            <div className={styles.boxShadow}>
              <TableTab
                columns={columns}
                dataSource={store?.screenList?.personnelAndCompanyCountVO || []}
                options={{ title: '各区企业与人员数量统计' }}
                rowKey='area'
                heightType={968}
                border={false}
                line
                selectRowChange={selectItem}
                cilckTitle={cilckTitle}
              />
            </div>
          </div>
        </div>
        <div className={styles.img_wrap}>
          {showLeft ? (
            <img onClick={() => setShowLeft(!showLeft)} alt='' src={leftBtn} />
          ) : (
            <img onClick={() => setShowLeft(!showLeft)} alt='' src={leftBtnActive} />
          )}
        </div>
      </div>
      <div className={styles.search}>
        <Search onSearch={onSearch} hiddenSelect placeholder='请输入地址' searchType='user' showSeach={true} />
      </div>
      <div>
        <Button type='primary' className={styles.btn_search} onClick={() => setIsModalVisible(true)}>
          保供人员状态
        </Button>
      </div>
      <div className={styles.right}>
        <div className={styles.img_wrap}>
          {showRight ? (
            <img onClick={() => setShowRight(!showRight)} alt='' src={rightBtn} />
          ) : (
            <img onClick={() => setShowRight(!showRight)} alt='' src={rightBtnActive} />
          )}
        </div>

        {/* <div className={styles.image_tab}> // 图片
          <ImageTab option={imageTabOption} switchImage={switchImage} />
        </div> */}
        <div className={`${styles.com_padding} ${showRight ? styles.show : styles.hidden}`}>
          <div className={styles.content_wrap}>
            <div className={styles.table_tab}>
              <div className={styles.boxShadow}>
                <TableTab
                  columns={surveyColumns}
                  dataSource={store?.staffList || []}
                  options={{ title: '人员概况' }}
                  rowKey='type'
                  heightType={400}
                  // selectRowChange={selectArea}
                  border={false}
                />
              </div>
            </div>
            <div className={styles.boxShadow}>
              {/* <Card title='北京进口非冷链货物从业人员' ext='' style={{ height: '264px' }}>
              <div className={styles.card_content}>
                {dataList.map(({ title, num, unit }) => {
                  return (
                    <div className={styles.item} key={num}>
                      <div className={styles.title}>{title}</div>
                      <div className={styles.desc}>
                        {num}
                        <span className={styles.unit}>{unit}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card> */}

              <Card title='人员状态及数量' ext='' heightType={264}>
                <div className={styles.card_content}>
                  {store?.stateList?.map(({ type, count, unit = '人' }) => {
                    return (
                      <div className={styles.item} key={count} onClick={showSupplyModal({ type })}>
                        <div className={styles.title}>{type}</div>
                        <div className={styles.desc}>
                          {/* { count } */}
                          {type === '保供白名单人员' ? store.whitePepoleNumForOa : count}
                          <span className={styles.unit}>{unit}</span>
                        </div>
                      </div>
                    );
                  })}
                  <div className={styles.text}>
                    {/* <p>  */}
                    {moment().format('YYYY-MM-DD')}白名单申报新增{store?.whiteText?.todayApplyUserCount}人， 审核通过
                    {store?.whiteText?.todayActiveUserCount}人，通过率{store?.whiteText?.todayActiveRate}； 当日申报移除
                    {store?.whiteText?.todayRemoveUserCount}人，在册人员净增加{store?.whiteText?.totalApplyUserCount}
                    人。 截至{moment().format('YYYY-MM-DD')}，{area ? area : '各区'}累计申报新增
                    {store?.whiteText?.totalActiveUserCount}人， 审核通过{store?.whiteText?.totalActiveUserCount}
                    人，通过率{store?.whiteText?.totalActiveRate}； 累计申报移除{store?.whiteText?.totalRemoveUserCount}
                    人，在册{store?.whiteText?.activeUserCount}人。
                    {/* </p> */}
                  </div>
                </div>
              </Card>
            </div>
            {store?.querySealingSealingTypeData?.length > 0 && (
              <div className={styles.boxShadow}>
                <Card title='封管控区数量统计' ext='' heightType={264}>
                  <div className={styles.card_content}>
                    {store?.querySealingSealingTypeData?.map(({ sealingName, plotCount, unit = '个' }) => {
                      return (
                        <div className={styles.item} key={sealingName}>
                          <div className={styles.title}>{sealingName}</div>
                          <div className={styles.desc}>
                            {plotCount}
                            <span className={styles.unit}>{unit}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
      <Modal
        visible={isModalVisible}
        zIndex={10001}
        centered
        width='80%'
        bodyStyle={{
          minHeight: '700px',
          overflow: 'hidden',
          padding: 0,
          margin: 0,
        }}
        footer={null}
        sticky
        destroyOnClose
        wrapClassName={styles.userChartDialog}
        closable={false}
      >
        <div className='tabs_top'>
          <p className='title'>保供人员状态</p>
          <img src={require('@/assets/images/solution_title_icon.png')} alt='' />
          <img
            onClick={() => setIsModalVisible && setIsModalVisible(false)}
            src={require('@/assets/images/clos_icon_night.png')}
            alt=''
          />
        </div>
        <SearchPage />
      </Modal>

      <Modal
        visible={isModalVisible1}
        zIndex={10001}
        centered
        width='80%'
        bodyStyle={{
          padding: '0px',
          margin: 0,
        }}
        footer={null}
        sticky
        destroyOnClose
        wrapClassName={styles.userChartDialog}
        closable={false}
      >
        <div className='tabs_top'>
          <p className='title'>保供白名单人员</p>
          <img src={require('@/assets/images/solution_title_icon.png')} alt='' />
          <img
            onClick={() => setIsModalVisible1 && setIsModalVisible1(false)}
            src={require('@/assets/images/clos_icon_night.png')}
            alt=''
          />
        </div>
        <iframe
          style={{ border: 0, width: '100%', height: '800px', padding: '0px 24px' }}
          src={`${outOaURL}/jczl/swj-whitelist/#/statistic?from=gis&token=${store.accessTokenForOa}`}
        />
      </Modal>
    </div>
  );
}

export default inject('gis')(observer(User));
