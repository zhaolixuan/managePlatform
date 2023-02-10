/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import {
    Form,
    Table,
    Input,
    Button,
    Select,
    message,
    InputNumber,
    Tooltip,
    Modal,
    Image
} from '@jd/find-react';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import MapDraw from '@/components/MapDraw';
import { useStore, useRouter } from '@/hooks';
import styles from '../index.module.less';
import { typeList } from '../constant';
import { addRegions } from '@/api/manageSite';
import Upload from '@/components/Upload';
import ModalFooter from '@/views/Manage/componets/ModalFooter';

const TableList = ({ permissionData, onChangeIds, searchinput }) => {
    const [ids, setIds] = useState([]);
    const [spinStatus, setSpinStatus] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [editingKey, setEditingKey] = useState('');
    const [fileData, setFileData] = useState([]);
    const [form] = Form.useForm();
    const store = useStore('grainoil');
    const packetControlStore = useStore('packetControl');
    const { history } = useRouter();
    const [mapData, setMapData] = useState({
        latitude: '',
        longitude: '',
        id: '',
        polygon: ''
    });
    const [theme, setTheme] = useState('white');
    const context = require.context('@/assets/images', true, /.png$/)
    const wrongImg = context(`./${theme}/wrong-img.png`)
    const [mapOpenStatus, setMapOpenStatus] = useState(false);

    // const siteTypeList = ['批发市场', '连锁超市门店', '直营直供', '社区菜市场', '前置仓', '电商大仓', '超市门店', '蔬菜直通车'];
    // const siteTypeList = {

    // }


    const tableSelect = {
        siteTypeList: store?.sealingTypeList?.map(item => ({
            value: item.childrenCode * 1, label: item.childrenName
        })),
        administrativeList: store?.areaList?.map((item) => ({
            value: item.childrenName, label: item.childrenName
        })),
        streetList: store?.streetList?.map((item) => ({
            value: item.childrenName, label: item.childrenName
        })),
    };

    // 选择的数据
    const changeSelect = (record, selectedRows) => {
        setSelectedRowKeys(selectedRows.map((item) => item.id));
        const idsArr = selectedRows.map((item) => item.id);
        setIds(idsArr);
        onChangeIds && onChangeIds(idsArr)
    };

    // 全选/非全选
    const onSelectAll = (selected) => {
        setSelectedRowKeys(selected ? store?.tableData.map(item => item.id) : []);
        const idsArr = store?.tableData.map(item => item.id);
        setIds(idsArr);
        onChangeIds && onChangeIds(idsArr)

    }

    const rowSelection = {
        type: 'checkbox',
        onChange: changeSelect,
        getCheckboxProps: (record) => ({
            ...record,
            // disabled: record.status * 1 !== 0,
        }),
        selectedRowKeys,
        onSelectAll
    };

    const deleteItem = ({ id }) => {
        Modal.confirm({
            title: '确定删除吗?',
            className: styles.confirm_wrap,
            async onOk () {
                try {
                    await store.deleteItem(id);
                    searchinput.current.input.input.value = ''
                    searchinput.current.input.state.value = ''
                    message.success('删除成功');
                    await store.regionsPageList()
                } catch (error) {
                    console.log(error);
                }
            }
        });
    }

    const editPosition = async (item) => {
        await store.getSiteLonLat({
            businessTypes: [item.businessType]
        });
        setMapOpenStatus(true);
        setMapData({
            ...mapData,
            liveName: item.businessName,
            ...item
        })
    };

    const changeArea = (value) => {
        const streetId = store?.areaList?.filter(item => item.childrenName === value)[0]?.id;
        form.setFieldsValue({ street: null });
        store.queryDictionaryList({
            parentCode: 'DICT_QYJD',
            parentId: streetId
        });
    }
    const changeUpImgage = (file) => {

        form.setFieldsValue({
            pictureDetails: file[0]?.thumbUrl || ''
        })
    }

    const columns = [
        {
            title: '日期',
            dataIndex: 'planDate',
            key: 'planDate',
            width: 200,
            render: text => <>{text || '-'}</>
        },
        {
            title: '商品名称',
            dataIndex: 'goodsName',
            key: 'goodsName',
            width: 120,
            render: text => <Tooltip title={text}>
                <div className={styles.liveName}>
                    {text}
                </div>
            </Tooltip>
        },
        {
            title: '计量单位',
            dataIndex: 'unit',
            key: 'unit',
            width: 110,
            render: text => <>{text || '-'}</>
        },
        {
            title: '昨日储备数量',
            dataIndex: 'preStock',
            key: 'preStock',
            width: 120,
            render: text => <>{text || '-'}</>
        },
        {
            title: '昨日储备保障天数',
            dataIndex: 'preEnsureDay',
            key: 'preEnsureDay',
            width: 150,
            render: text => <>{text || '-'}</>
        },
        {
            title: '计划新增储备量',
            dataIndex: 'planAddStock',
            key: 'planAddStock',
            width: 160,
            render: text => <>{text || '-'}</>
        },
        {
            title: '计划最终库储量',
            dataIndex: 'planStock',
            key: 'planStock',
            width: 160,
            render: text => <>{text || '-'}</>
        },
        {
            title: '计划保障天数',
            dataIndex: 'planEnsureDay',
            key: 'planEnsureDay',
            width: 150,
            render: text => <>{text || '-'}</>
        },
        {
            title: '计划到位时间',
            dataIndex: 'planImplDate',
            key: 'planImplDate',
            width: 180,
            render: text => <>{text || '-'}</>
        },



        {
            title: '进库量',
            dataIndex: 'warehouseEnter',
            key: 'warehouseEnter',
            width: 80,
            render: text => <>{text || '-'}</>
        },
        {
            title: '出库量',
            dataIndex: 'warehouseOut',
            key: 'warehouseOut',
            width: 100,
            render: text => <>{text || '-'}</>
        },


        {
            title: '库存数量',
            dataIndex: 'stock',
            key: 'stock',
            width: 80,
            render: text => <>{text || '-'}</>
        },
        {
            title: '保障天数',
            dataIndex: 'ensureDay',
            key: 'ensureDay',
            width: 90,
            render: text => <>{text || '-'}</>
        },
        {
            title: '昨日对比',
            dataIndex: 'stockRate',
            key: 'stockRate',
            width: 120,
            render: text => <>{text || '-'}</>
        },


        // {
        //     title: '操作',
        //     dataIndex: 'action',
        //     key: 'action',
        //     width: 260,
        //     align:'center',
        //     fixed: 'right',
        //     render: (_, record) => {
        //         const editable = isEditing(record);
        //         return editable ? (
        //             <div style={{ display: 'flex' }}>
        //                 <Button
        //                     onClick={() => save(record.id)}
        //                     style={{
        //                         marginRight: 8,
        //                     }}
        //                     type='primary'
        //                 >
        //                     保存
        //                 </Button>
        //                 <Button onClick={cancel}>取消</Button>
        //             </div>
        //         ) : (
        //             <>
        //                 <Button type='link' style={{ display: permissionData.SiteEditAttribute ? 'inline-block' : 'none', }} onClick={() => edit(record)}>
        //                     编辑属性
        //                 </Button>
        //                 <Button type='link' style={{ display: permissionData.SiteEditCoordinate ? 'inline-block' : 'none', }} onClick={() => editPosition(record)}>
        //                     编辑坐标
        //                 </Button>
        //                 <Button type='link' style={{ display: permissionData.SiteSaleCheck ? 'inline-block' : 'none', }} onClick={() => history.push({ pathname: '/manage/control/site/stock-sell-storage', search: `?name=${record.businessName}&id=${record.id}&businessType=${record.businessType}` })}>
        //                     进销存维护
        //                 </Button>
        //                 <Button type='link' style={{ display: permissionData.SiteDelect ? 'inline-block' : 'none', }} onClick={() => deleteItem(record)}>
        //                     删除
        //                 </Button>
        //             </>
        //         );
        //     },
        // },
    ];

    const isEditing = (record) => record.id === editingKey;
    const edit = async (record) => {
        const obj = [{
            uid: record.id,
            response: {
                fileName: record.pictureDetails.split('/')[record.pictureDetails.split('/').length - 1],
            },
            thumbUrl: record.pictureDetails,
        }]
        record.pictureDetails && setFileData(obj)
        form.setFieldsValue({
            ...record,
        });
        setEditingKey(record.id);
        const streetId = store?.areaList?.filter(item => item.childrenName === record.area)[0]?.id;
        store.queryDictionaryList({
            parentCode: 'DICT_QYJD',
            parentId: streetId
        });
    };

    const cancel = () => {
        setEditingKey('');
    };

    // 表格编辑
    const save = async (id) => {
        try {
            const row = await form.validateFields();
            await addRegions({
                ...row,
                id
            });
            store.regionsPageList();
            setEditingKey('');
            store.update({
                streetList: []
            });
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }

        return {
            ...col,
            onCell: (record) => ({
                record,
                selectData: col.selectData,
                inputType: col.inputType,
                onChange: col.onChange ? col.onChange : () => { },
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            })
        };
    });

    const EditableCell = ({
        editing,
        dataIndex,
        title,
        inputType,
        onChange,
        record,
        index,
        children,
        selectData,
        ...restProps
    }) => {
        const inputNodeList = {
            number: <InputNumber placeholder={`请输入${title}`} onChange={onChange} />,
            input: <Input placeholder={`请输入${title}`} onChange={onChange} />,
            select: <Select placeholder={`请选择${title}`} onChange={onChange} options={tableSelect[selectData] || []} />,
            upload: <Upload maxCount='1' fileData={fileData} fileTypes={['png', 'jpg', 'jpeg']} onChange={onChange} />
        }
        const inputNode = inputNodeList[inputType];
        const messageFun = (inputType, title) => {
            if (inputType == 'select') {
                return `请选择${title}!`
            } else if (inputType == 'input') {
                return `请输入${title}!`
            } else {
                return `请上传!`
            }
        }
        return (
            <td {...restProps}>
                {editing ? (
                    <Form.Item
                        name={dataIndex}
                        style={{
                            margin: 0,
                        }}
                        rules={[
                            {
                                required: true,
                                message: messageFun(inputType, title),
                            },
                        ]}
                    >
                        {inputNode}
                    </Form.Item>
                ) : (
                    children
                )}
            </td>
        );
    };

    const changePage = (pageObj) => {
        store.update({
            pagination: pageObj
        });
        store.regionsPageList({
            ...store.requestParama,
            ...pageObj,
            page: pageObj.current
        });
    }

    // 编辑坐标点
    const saveDrawData = async (data) => {
        setSpinStatus(true);
        await addRegions({
            ...data.mapData,
            latitude: data.latitude,
            longitude: data.longitude,
        });
        setSpinStatus(false);
        setMapOpenStatus(false);
        store.regionsPageList();
        store.update({
            gisData: []
        });
    }

    // 批量导入
    // const batchStorage = () => {
    //   if (!ids.length) return message.error('请勾选需要批量导入的数据');
    //   try {
    //     Modal.confirm({
    //       title: '确定批量导入吗？',
    //       async onOk() {
    //         await packetControlStore.saveStore({ ids });
    //         message.success('批量导入成功');
    //         packetControlStore.querySealingList(queryParams);
    //         setIds([]);
    //         setSelectedRowKeys([]);
    //       },
    //     });
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };
    useEffect(() => {
        setIds([])
        setSelectedRowKeys([])
    }, [store?.tableData]);


    return (
        <>
            <Form form={form} component={false}>
                <Table
                    components={{
                        body: {
                            cell: EditableCell,
                        },
                    }}
                    loading={store.loading}
                    dataSource={store?.tableData || []}
                    columns={mergedColumns}
                    rowClassName='editable-row'
                    pagination={{ ...store.pagination, showSizeChanger: true, showQuickJumper: true, showLessItems: true, showTotal: (total) => `共 ${total} 条` }}
                    rowSelection={rowSelection}
                    onChange={changePage}
                    scroll={{ x: 'max-centent', y: 'calc(100vh - 56px - 38px - 200px)' }}
                    rowKey='id'
                />
            </Form>
            {mapOpenStatus && <MapDraw
                visible={mapOpenStatus}
                saveDrawData={saveDrawData}
                setMapData={setMapData}
                poiSearch={packetControlStore.poiSearch}
                handleCancel={() => {
                    setMapOpenStatus(false);
                    store.update({
                        gisData: []
                    });
                }}
                mapData={mapData}
                theme={theme}
                drawAreaTabStatus={false}
                drawPointTabStatus
                drawPointStatus
                drawPolygonStatus={false}
                markerLayerStatus
                typeList={typeList}
                markerData={store?.gisData || []}
                showModal
                scale={1}
                spinStatus={spinStatus}
            />}
        </>
    )
}
export default observer(TableList);
