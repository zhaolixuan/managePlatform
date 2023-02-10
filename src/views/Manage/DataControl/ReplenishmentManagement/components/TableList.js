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
    Modal
} from '@jd/find-react';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import MapDraw from '@/components/MapDraw';
import { useStore, useRouter } from '@/hooks';
import styles from '../index.module.less';
import { typeList } from '../constant';
import { addRegions } from '@/api/ReplenishmentManagement';

const TableList = ({ permissionData, showrowSelection = false, onChangeIds,searchinput }) => {
    const [ids, setIds] = useState([]);
    const [spinStatus, setSpinStatus] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [editingKey, setEditingKey] = useState('');
    const [form] = Form.useForm();

    const store = useStore('replenishmentManagement');
    const packetControlStore = useStore('packetControl');
    const { history } = useRouter();

    const [mapData, setMapData] = useState({
        latitude: '',
        longitude: '',
        id: '',
        polygon: ''
    });
    const [theme, setTheme] = useState('white');
    const [mapOpenStatus, setMapOpenStatus] = useState(false);

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
        console.log(selected, 2);
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
                    searchinput.current.input.input.value=''
                    searchinput.current.input.state.value=''
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

    const columns = [
        {
            title: '地区名称',
            dataIndex: 'businessName',
            key: 'businessName',
            width: 180,
            editable: true,
            inputType: 'input',
            fixed: 'left',
            render: text => <Tooltip title={text}>
                <div className={styles.liveName}>
                    {text}
                </div>
            </Tooltip>
        },
        {
            title: '创建人',
            dataIndex: 'createUser',
            key: 'createUser',
            width: 80,
            render: text => <>{text || '-'}</>
        },
        {
            title: '所属部门',
            dataIndex: 'department',
            key: 'department',
            width: 180,
            render: text => <>{text || '-'}</>
        },
        {
            title: '场所类型',
            dataIndex: 'businessType',
            key: 'businessType',
            width: 100,
            editable: true,
            inputType: 'select',
            selectData: 'siteTypeList',
            render: (text) => <>{tableSelect?.siteTypeList?.filter(item => item.value === text)[0]?.label || '-'}</>
        },
        {
            title: '所属行政区',
            dataIndex: 'area',
            key: 'area',
            width: 120,
            editable: true,
            inputType: 'select',
            selectData: 'administrativeList',
            onChange: changeArea,
            render: text => <>{text || '-'}</>
        },
        {
            title: '所属街道',
            dataIndex: 'street',
            key: 'street',
            width: 180,
            editable: true,
            inputType: 'select',
            selectData: 'streetList',
            render: text => <>{text || '-'}</>
        },
        {
            title: '地址',
            dataIndex: 'address',
            key: 'address',
            width: 180,
            editable: true,
            inputType: 'input',
            render: text => <>{text || '-'}</>
        },
        {
            title: '联系人',
            dataIndex: 'contacts',
            key: 'contacts',
            width: 100,
            editable: true,
            inputType: 'input',
            render: text => <>{text || '-'}</>
        },
        {
            title: '联系方式',
            dataIndex: 'contactNumber',
            key: 'contactNumber',
            width: 100,
            editable: true,
            inputType: 'input',
            render: text => <>{text || '-'}</>
        },

        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            width: 260,
            align:'center',
            fixed: 'right',
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <div style={{ display: 'flex' }}>
                        <Button
                            onClick={() => save(record.id)}
                            style={{
                                marginRight: 8,
                            }}
                            type='primary'
                        >
                            保存
                        </Button>
                        <Button onClick={cancel}>取消</Button>
                    </div>
                ) : (
                    <>
                        <Button type='link' style={{ display: permissionData.ReplenishmentEditAttribute ? 'inline-block' : 'none' }} onClick={() => edit(record)}>
                            编辑属性
                        </Button>
                        <Button type='link' style={{ display: permissionData.ReplenishmentEditCoordinate ? 'inline-block' : 'none' }} onClick={() => editPosition(record)}>
                            编辑坐标
                        </Button>
                        <Button type='link' style={{ display: permissionData.replenishmentOfFill ? 'inline-block' : 'none' }} onClick={() => history.push({ pathname: '/manage/control/replenishment-management/shortage-of-fill', search: `?name=${record.businessName}&id=${record.id}` })}>
                            缺货填报
                        </Button>
                        <Button type='link' style={{ display: permissionData.ReplenishmentDelect ? 'inline-block' : 'none' }} onClick={() => deleteItem(record)}>
                            删除
                        </Button>
                    </>
                );
            },
        },
    ];

    const isEditing = (record) => record.id === editingKey;

    const edit = (record) => {
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
        store.update({
            streetList: []
        });
    };

    // 表格编辑
    const save = async (id) => {
        try {
            const row = await form.validateFields();
            await addRegions({
                ...row,
                id
            })
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
                dataIndex: col.dataIndex,
                title: col.title,
                onChange: col.onChange,
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
        }

        const inputNode = inputNodeList[inputType];
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
                                message: `请输入 ${title}!`,
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
        store.regionsPageList();
    }

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
                    rowSelection={showrowSelection ? rowSelection : null}
                    onChange={changePage}
                    scroll={{ x: 'max-centent', y: '620px' }}
                    rowKey='id'
                    on
                />
            </Form>
            {mapOpenStatus && <MapDraw
                visible={mapOpenStatus}
                saveDrawData={saveDrawData}
                setMapData={setMapData}
                setVisible={setMapOpenStatus}
                poiSearch={packetControlStore.poiSearch}
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

                handleCancel={() => {
                    setMapOpenStatus(false);
                    store.update({
                        gisData: []
                    });
                }}
                spinStatus={spinStatus}
            />}
        </>
    )
}
export default observer(TableList);
