/* eslint-disable */
import { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import { assign, union, difference } from 'lodash';
import { Button, Modal } from '@jd/find-react';
import { useStore, useRouter } from '@/hooks';
import Markers from '@/components/GisMap';
import TableTab from '@/components/TableTab';
import PlaceNumber from '@/components/PlaceNumber';
import ImageTab from '@/components/ImageTab';
import CheckBox from '@/components/CheckBox';
import Chart from '@/components/Chart';
import Search from '@/components/Search';
import Card from '@/components/Card';
import JdProgress from '@/components/Progress';
import * as api from '@/api/gisOther';
import { checkList, selsctList, iframeCheckDefList } from './config';
// import * as siteApi from '@/api/site';
import styles from './index.module.less';

const Site = () => {
    const {
        query: { iframe, theme: frameTheme },
    } = useRouter();
    const store = useStore('site');
    const { siteDetails, orderQuantity } = useStore('site');
    const { checkboxStatus } = useStore('gis');
    const {
        curRegion,
        setCurRegion,
        activeMarkerInfo,
        setActiveMarkerInfo,
        markerStatus,
        setMarkerStatus,
        setIsClickedPicture,
        isClickedPicture,
        setTheme,
        setCheckboxStatus,
        theme,
    } = useStore('gis');
    const sessionArea = sessionStorage.getItem('area');
    const [zoom, setZoom] = useState(!iframe ? (curRegion ? 0 : 8.5) : 8.1);
    const [updateCenter, setUpdateCenter] = useState(null);
    const [checkboxDefaultValue, setCheckboxDefaultValue] = useState([]);
    const [showLeft, setShowLeft] = useState(!iframe);
    const [showRight, setShowRight] = useState(!iframe);
    const [showLogin, setShowLogin] = useState(false);
    const [num, setNum] = useState(1);
    const center = !iframe ? (sessionArea ? null : [116.38, 40.245999]) : [116.38, 39.645999];
    const dpr = Math.round((Number(document.querySelector('html').style.fontSize.slice(0, -2))))
    // console.log(dpr ,'11111');

    const columns = [
        {
            title: '行政区',
            dataIndex: 'area',
            key: 'area',
            render: (text, item) => (
                <div className={styles.bar}>
                    <span className={styles.mr_r}>{text}</span>
                    {item?.number && (
                        <JdProgress
                            percent={(item?.number / store?.siteTypeStatistics[0]?.number) * 100}
                            steps={40}
                            size='small'
                            showInfo={false}
                            theme={theme}
                        />
                    )}
                </div>
            ),
            width: '80%',
        },
        {
            title: '数量',
            dataIndex: 'number',
            key: 'number',
            align: 'right'
        },
    ];

    // 多选框事件
    const changeCheck = (value) => {
        store.update({
            paramsObj: {
                ...store.paramsObj,
                businessTypes: value,
            },
        });
        store.getSiteLonLat({
            ...store.paramsObj,
            businessTypes: value,
        });
    };

    // 左侧场所点击
    const selectItem = (item) => {
        // console.log('selectItem', item);
        setCurRegion(item.area);
        store.update({
            paramsObj: {
                ...store.paramsObj,
                area: item.area,
            },
        });
        // 场所数量
        store.siteNumber({
            area: item.area,
        });
        store.getSiteLonLat({
            ...store.paramsObj,
            area: item.area,
        });
    };

    // 搜索组件事件
    const onSearch = ({ businessName, value }) => {
        store.update({
            paramsObj: {
                ...store.paramsObj,
                businessTypes: value ? [value] : [1, 2, 3, 4, 5, 6, 7, 8],
                businessName: businessName || '',
            },
        });
        store.getSiteLonLat({
            ...store.paramsObj,
            businessTypes: value ? [value] : [1, 2, 3, 4, 5, 6, 7, 8],
            businessName: businessName || '',
        });
    };

    // 八大市场配置
    const imageTabOption = {
        tabTitle: '八大批发市场',
        hasHead: true,
        imageList: store?.pictureSourceList, // 列表数据
    };

    // 点击右侧图片定位到地图上某一个点
    const switchImage = async (item) => {
        // const res = await siteApi.siteDetails(item?.id);
        // const indentNum = await siteApi.orderQuantity({
        //   latitude: item.latitude,
        //   longitude: item.longitude
        // })
        // item?.id &&
        //   setActiveMarkerInfo({
        //     markerId: res?.id,
        //     lng: res?.longitude,
        //     lat: res?.latitude,
        //     type: '批发市场',
        //     num: '',
        //     popupType: 1,
        //     ...res,
        //     indentNum
        //   });
        if (item) {
            const indentNum = await orderQuantity({
                latitude: item.lat,
                longitude: item.lng,
            });
            const markerDetail = await siteDetails(item.id)
            setActiveMarkerInfo({
                markerId: markerDetail?.id,
                lng: markerDetail?.longitude,
                lat: markerDetail?.latitude,
                type: '批发市场',
                num: '',
                popupType: 1,
                ...markerDetail,
                indentNum,
                showMore: function () {
                    console.log('------------------')
                    api.gotoShowMore(item);
                },
            })
        }
        item && setMarkerStatus(!markerStatus);
        item && setIsClickedPicture(true);
    };

    // 点击北京清除画圈
    const cilckTitle = () => {
        // console.log('cilckTitle');
        store.update({
            paramsObj: {
                // businessTypes: [1, 2, 3, 4, 5, 6, 7, 8],
                // businessName: '',
                ...store.paramsObj,
                area: '',
            },
        });
        setZoom(8);
        // setUpdateCenter(new Date().getTime());
        setCurRegion('北京');
        // 场所数量
        store.siteNumber({
            ...store.paramsObj,
        });
        store.getSiteLonLat({
            ...store.paramsObj,
        });
    };

    // 点击图片获取详情
    const getDetail = () => {
        activeMarkerInfo?.id &&
            store.siteDetails(activeMarkerInfo?.id).then(async (res) => {
                setActiveMarkerInfo({
                    markerId: res?.id,
                    lng: res?.longitude,
                    lat: res?.latitude,
                    type: '',
                    num: '',
                    popupType: 1,
                    ...res,
                    // url: imgList[res?.businessType - 1],
                });
            });
    };

    // 下拉选值改变重新请求数据
    const selectChange = (value) => {
        store.update({ ...store.paramsObj, businessTypes: [value] });
        store.getSiteLonLat({ ...store.paramsObj, businessTypes: [value] });
    };

    const configCheckList = (checkList, checkedValues, nowAddValue, nowDelValue) => {
        const computedValue =
            nowAddValue.length > 0 ? union(checkedValues, nowAddValue) : difference(checkedValues, nowDelValue);
        setCheckboxDefaultValue(computedValue);
        changeCheck(computedValue);
        store.update({ enclosureCheckList: checkList });
    };

    // 地图Marker点击回调
    const handleMarkerClick = async (item) => {
        const marker = {};
        if (item) {
            const indentNum = await orderQuantity({
                latitude: item.lat,
                longitude: item.lng,
            });
            // const { pictureDetails } = await siteDetails(item.id);
            // 表格行数据不全 需要拿接口里所有的数据
            const res = await siteDetails(item.id)
            console.log(res);
            assign(marker, item, {
                indentNum,
                url: res?.pictureDetails,
                ...res,
                showMore: function () {
                    api.gotoShowMore(this);
                },
            });
        }
        setActiveMarkerInfo(marker);
    };
    // 地图图例图标点击回调
    const changeLegend = (value) => {
        setCheckboxStatus(value);
    };

    useEffect(() => {
        if (frameTheme && theme !== frameTheme) {
            setTheme(frameTheme);
        }
    }, [frameTheme]);
    // 监听地图图标点击行为
    useEffect(() => {
        markerStatus === 'active' && getDetail();

        !!iframe && setUpdateCenter(new Date().getTime());
    }, [markerStatus]);

    useEffect(() => {
        // !!iframe && setTheme( 'dark' )
        store.update({ enclosureCheckList: !iframe ? store.checkBoxData : iframeCheckDefList });
        iframe && setZoom(7.8);
    }, [iframe]);

    useEffect(() => {
        store.update({
            paramsObj: {
                ...store.paramsObj,
                area: curRegion === '北京' ? '' : curRegion,
            },
        });

        // 获取各行政区场所统计值
        store.getSiteTypeStatistics();
        // 获取地图上的点
        store.getSiteLonLat();
        // 折线图
        store.marketSale();
        // 八大批发市场
        store.pictureSource();

        // 获取图例
        store.getCheckBoxData({
            parentCode: 'DICT_REGIONTYPE'
        }, checkList,selsctList);

        // 场所数量
        store.siteNumber({ area: curRegion === '北京' ? '' : curRegion });
        console.log('effect curRegion', curRegion)
    }, [curRegion]);

    // 初始话请求数据
    useEffect(() => {
        store.update({
            paramsObj: {
                ...store.paramsObj,
                area: curRegion === '北京' ? '' : curRegion,
            },
        });

        // 获取各行政区场所统计值
        store.getSiteTypeStatistics();
        // 获取地图上的点
        store.getSiteLonLat();
        // 折线图
        store.marketSale();
        // 八大批发市场
        store.pictureSource();

        // 获取图例
        store.getCheckBoxData({
            parentCode: 'DICT_REGIONTYPE'
        }, checkList,selsctList);
        return () => {
            setCheckboxStatus(false);
            setCurRegion(sessionStorage.getItem('area'));
            store.update({
                gisData: {
                    markerData: [],
                    zoneData: [],
                },
                // enclosureCheckList: [],
                paramsObj: {
                    // 请求地图点位数据
                    businessTypes: [],
                    businessName: '',
                    area: '',
                },
            });
        };
    }, []);

    const stylesObj = {
        1: {
            left: '168px',
            top: '383px',
            width: '257px',
            height: '42px',
        },
        2: {
            left: '237px',
            top: '504px',
            width: '114px',
            height: '33px',
        },
        3: {
            left: '226px',
            top: '383px',
            width: '114px',
            height: '33px',
        },
    };

    const positionIcon = showRight ? 386 : 22;
    const scaleRight = !iframe ? (showRight ? '23%' : '4%') : '760px';
    const leftBtn = require(`@/assets/images/${theme}/left_normal.png`);
    const leftBtnActive = require(`@/assets/images/${theme}/left_active.png`);
    const rightBtn = require(`@/assets/images/${theme}/right_normal.png`);
    const rightBtnActive = require(`@/assets/images/${theme}/right_active.png`);
    // iframe && setZoom(7.8)
    return (
        <div className={styles.site_wrap}>
            <Markers
                // zoom={zoom}
                // center={center}
                activeArea={curRegion}
                markerData={toJS(store.gisData.markerData)}
                handleMarkerClick={handleMarkerClick}
                activeMarker={activeMarkerInfo}
                changeLegend={changeLegend}
                toolConfig={{ show: true, right: positionIcon }}
                // data={toJS(store.gisData)}
                // showMore={api.gotoShowMore}
                scaleConfig={{ status: true, bottom: '25px', right: scaleRight }}
            // zoomToolConfig={{ status: true, bottom: '20px', right: positionIcon }}
            // originToolConfig={{ status: true, bottom: '95px', right: positionIcon }}
            // dimensionToolConfig={{ status: true, bottom: '131px', right: positionIcon }}
            // themeToolConfig={{ status: true, bottom: '203px', right: positionIcon }}
            // checkboxToolConfig={{status: true, bottom: '167px', right: positionIcon}}
            // zoom={zoom}
            // minZoom={7}
            // center={center}
            // updateCenter={updateCenter}
            />
            {!iframe &&
                <div className={styles.login_btn}>
                    {/* <Button type='primary' onClick={() => setShowLogin(true)}>
            社区菜市场数据采集
          </Button> */}

                    <Modal
                        title='社区菜市场数据采集'
                        visible={showLogin}
                        onOk={() => {
                            setShowLogin(false);
                            setNum(1);
                        }}
                        onCancel={() => {
                            setShowLogin(false);
                            setNum(1);
                        }}
                        zIndex='99999999999'
                    >
                        <div className={styles.login_page}>
                            <img src={require(`@/assets/images/cs_${num}.png`)} alt='' />
                            <div
                                className={styles.login_btn}
                                style={stylesObj[num]}
                                onClick={() => (num === 3 ? (setShowLogin(false), setNum(1)) : setNum(num !== 3 ? num + 1 : 1))}
                            ></div>
                        </div>
                    </Modal>
                </div>
            }
            <div className={`${styles.left} ${iframe ? styles.mobileP : ''}`}>
                <div className={`${styles.com_padding} ${showLeft ? styles.show : styles.hidden}`}>
                    {/* <TableList
            columns={columns}
            dataSource={store.siteTypeStatistics}
            style={{ width: 352 }}
            title='各行政区场所统计值'
            onClick={selectItem}
            cilckTitle={cilckTitle}
          /> */}
                    <div className={styles.table_list}>
                        <div className={styles.boxShadow}>
                            <TableTab
                                columns={columns}
                                dataSource={store?.siteTypeStatistics || []}
                                options={{ title: '各行政区场所统计值' }}
                                rowKey='area'
                                styleType='site'
                                border={false}
                                line
                                selectRowChange={!sessionArea && selectItem}
                                cilckTitle={!sessionArea && cilckTitle}
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
            <div className={`${styles.right} ${iframe ? styles.mobileP : ''}`}>
                <div className={styles.img_wrap}>
                    {showRight ? (
                        <img onClick={() => setShowRight(!showRight)} alt='' src={rightBtn} />
                    ) : (
                        <img onClick={() => setShowRight(!showRight)} alt='' src={rightBtnActive} />
                    )}
                </div>
                <div className={`${styles.com_padding}  ${showRight ? styles.show : styles.hidden}`}>
                    <div className={styles.table_list}>
                        {!sessionArea ? (
                            <div className={styles.image_tab}>
                                <ImageTab option={imageTabOption} switchImage={switchImage} />
                            </div>
                        ) : (
                            ''
                        )}

                        <div className={styles.place_number}>
                            <div className={styles.boxShadow}>
                                <Card title='场所数量' ext={curRegion || '北京'}>
                                    <PlaceNumber list={store.placeNumberList} theme={theme} />
                                </Card>
                            </div>
                        </div>
                        <div className={`${styles.chartBox}`}>
                            <div className={styles.boxShadow}>
                                {!sessionArea && store?.marketSaleList?.xData?.length > 0 && (
                                    <Chart
                                        data={{
                                            x: store.marketSaleList.xData,
                                            y: store.marketSaleList.yData,
                                            title: '近七日批发市场上市量',
                                            unit: '（吨）',
                                        }}
                                        // style={{}}
                                        styleType='site'
                                        theme={theme}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {checkboxStatus && (
                <div
                    className={iframe ? styles.icheck_box : styles.check_box}
                >
                    <CheckBox
                        defaultValue={checkboxDefaultValue}
                        data={store?.enclosureCheckList}
                        setCheckBoxValue={(values) => changeCheck(values)}
                        isConfig={true}
                        defaultCheckList={store?.enclosureCheckList}
                        configCheckList={configCheckList}
                        allList={store?.checkBoxData}
                        iframe={iframe}
                        theme={theme}
                    />
                </div>
            )}
            {!iframe ? (
                <div className={styles.content_wrap}>
                    <Search
                        onSearch={onSearch}
                        searchType='site'
                        onChange={(value) => {
                            store.update({ ...store.paramsObj, businessName: value });
                        }}
                        selectChange={selectChange}
                        list={store?.selsctData}
                        placeholder='请输入场所名称'
                        // style={{ left: 385 }}
                        showSeach={true}
                    />
                    {/* <Button type='primary' className={styles.btn_search} onClick={() => window.open('https://bxp.sw.beijing.gov.cn/webroot/decision/login?origin=2f014d27-1bf1-46e1-8f1d-627d4e382a75')}>
            量价汇总表
          </Button> */}
                </div>
            ) : (
                ''
            )}
        </div>
    );
};

export default observer(Site);
