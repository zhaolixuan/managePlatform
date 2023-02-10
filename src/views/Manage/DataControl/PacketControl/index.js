/* eslint-disable */
import {
    Steps,
    Table,
    Form,
    Input,
    Button,
    Select,
    DatePicker,
    Badge,
    message,
    Modal,
    InputNumber,
    Tooltip,
} from '@jd/find-react';
import { RetweetOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import { querySealingList, batchDeleteSealingControl } from '@/api/packetControl';
import { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react';
import { useStore } from '@/hooks';
import UpFileModal from './components/upFileModal';
import { typeList } from './constant.js'
import styles from './index.module.less';
import Map from '@/components/MapDraw';
import { verificationPath } from '@/utils/Permission';

const PacketControl = () => {
    const [visible, setVisible] = useState(false);
    const [ids, setIds] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [permissionData, setPermissionData] = useState({});
    const store = useStore('packetControl');
    const [queryParams, setQueryParams] = useState({
        sealingDate: moment().format('YYYY-MM-DD'),
        page: store.pagination.page,
        pageSize: store.pagination.pageSize,
    });
    const [form] = Form.useForm();
    const [editingKey, setEditingKey] = useState('');
    const [stepStatus, setStepStatus] = useState(0);
    const [spinStatus, setSpinStatus] = useState(false);
    const [isImport, setIsImport] = useState(false);
    const [searchFrom] = Form.useForm();

    const [mapData, setMapData] = useState({});
    const [theme, setTheme] = useState('white');
    const [mapOpenStatus, setMapOpenStatus] = useState(false);
     const searchinput = useRef()

    const stepsList = [
        {
            title: '本地导入封控区属性',
            key: 0,
        },
        {
            title: '自动同步历史数据',
            key: 1,
        },
        {
            title: '编辑坐标属性组',
            key: 2,
        },
        {
            title: '自动预统计人口属性组',
            key: 3,
        },
        {
            title: '批量入库',
            key: 4,
        },
    ];

    const statusList = {
        0: <Badge color='#08B562' text='待导入' />,
        1: <Badge color='#FF802B' text='待编辑' />,
        2: <Badge color='#2C68FF' text='已完结' />,
    };

    const openMap = (data) => {
        console.log(data, 'data--');
        setMapOpenStatus(true);
        setMapData(data);
    };

    const columns = [
        {
            title: '区域名称',
            dataIndex: 'liveName',
            key: 'liveName',
            width: 180,
            fixed: 'left',
            render: (text) => (
                <Tooltip title={text}>
                    <div className={styles.liveName}>{text}</div>
                </Tooltip>
            ),
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
            title: '封控类型',
            dataIndex: 'sealingType',
            key: 'sealingType',
            width: 100,
            render: text => <>{text || '-'}</>
        },
        {
            title: '所属行政区',
            dataIndex: 'area',
            key: 'area',
            width: 120,
            render: text => <>{text || '-'}</>
        },
        {
            title: '所属街道',
            dataIndex: 'street',
            key: 'street',
            width: 100,
            render: text => <>{text || '-'}</>
        },
        {
            title: '封控日期',
            dataIndex: 'sealingDate',
            key: 'sealingDate',
            width: 140,
            render: text => <>{text || '-'}</>
        },
        {
            title: '封控开始日期',
            dataIndex: 'sealingStartDate',
            key: 'sealingStartDate',
            width: 120,
            render: text => <>{text || '-'}</>
        },
        {
            title: '管控户数',
            dataIndex: 'householdNum',
            key: 'householdNum',
            width: 120,
            editable: true,
            inputType: 'number',
            render: text => <>{text || '-'}</>
        },
        {
            title: '管控人数',
            dataIndex: 'peopleNum',
            key: 'peopleNum',
            width: 100,
            editable: true,
            inputType: 'number',
            render: text => <>{text || '-'}</>
        },
        {
            title: '配送人员数',
            dataIndex: 'giveNum',
            key: 'giveNum',
            width: 120,
            editable: true,
            inputType: 'number',
            render: text => <>{text || '-'}</>
        },
        {
            title: '管控区点数',
            dataIndex: 'spotNum',
            key: 'spotNum',
            width: 120,
            editable: true,
            inputType: 'number',
            render: text => <>{text || '-'}</>
        },
        {
            title: '数据状态',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (text) => <>{statusList[text * 1]}</>,
        },
        {
            title: '是否增量',
            dataIndex: 'isExist',
            key: 'isExist',
            sorter: (a, b) => a.isExist - b.isExist,
            defaultSortOrder: 'ascend',
            width: 120,
            render: (text) => <>{text * 1 ? <Badge color='#2C68FF' text='存量' /> : <Badge color='red' text='增量' />} </>,
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            width: 210,align:'center',
            align:'center',
            fixed: 'right',
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <div style={{ display: 'flex' }}>
                        <Button

                            onClick={() => save(record.key)}
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
                        <Button style={{ display: permissionData.DataEditPeople ? 'inline-block' : 'none', }} type='link' onClick={() => edit(record)}>
                            编辑人口
                        </Button>
                        <Button style={{ display: permissionData.DataEditCoordinate ? 'inline-block' : 'none', }} type='link' onClick={() => openMap(record)}>
                            编辑坐标
                        </Button>
                    </>
                );
            },
        },
    ];

    // 选择的数据
    const changeSelect = (record, selectedRows) => {
        setSelectedRowKeys(selectedRows.map((item) => item.key));
        setIsImport(!!selectedRows.filter(item => item.status * 1 === 1 || item.status * 1 === 2)?.length)
        const idsArr = selectedRows.map((item) => item.id);
        setIds(idsArr);
    };

    // 全选/非全选
    const onSelectAll = (selected) => {
        console.log(selected, 2);
        setSelectedRowKeys(
            selected ? store?.sealingList.map((item) => item.key) : [],
        );
        const idsArr = store?.sealingList.map((item) => item.id);
        setIds(idsArr);
    };

    const rowSelection = {
        type: 'checkbox',
        onChange: changeSelect,
        getCheckboxProps: (record) => ({
            ...record,
            //   disabled: record.status * 1 !== 0,
        }),
        selectedRowKeys,
        // onSelectAll,
    };

    // 当赛选条件发生改变是调用列表接口
    const formChange = (_, values) => {
        setQueryParams({
            ...queryParams,
            ...values,
            sealingDate: moment(values.sealingDate).format('YYYY-MM-DD'),
        });
    };

    const filterStatus = async () => {
        if (queryParams.sealingDate) {
            const res = await querySealingList({
                sealingDate: queryParams.sealingDate,
            });
            if (!res.length) {
                setStepStatus(0);
                return;
            }
            if (!res.every((item) => item.longitude && item.latitude)) {
                setStepStatus(3);
                return;
            }
            if (
                !res.every(
                    (item) => !isNaN(item.householdNum) && !isNaN(item.peopleNum) && !isNaN(item.giveNum) && !isNaN(item.spotNum),
                )
            ) {
                setStepStatus(4);
                return;
            }
            if (!res?.filter((item) => item.status * 1 === 0).length) {
                setStepStatus(5);
                return;
            } else {
                setStepStatus(4);
            }
        }
    };

    useEffect(() => {
        console.log(process.env, '12233');
        filterStatus();
        setSelectedRowKeys([]);
        setIds([]);
    }, [store.sealingList]);

    // 批量导入
    const batchStorage = () => {
        if (!ids.length) return message.error('请勾选需要批量导入的数据');
        if (isImport) return message.error('批量入库失败：仅支持待导入状态数据导入,请重新勾选数据');
        let arr = store?.sealingList.filter((item) => ids.includes(item.id) && item.status * 1 === 2)
        if (arr.length > 0) return message.error('当前勾选数据包含已入库数据，请重新选择');
        try {
            Modal.confirm({
                title: '确定批量导入吗？',
                async onOk () {
                    await store.saveStore({ ids });
                    message.success('批量导入成功');
                    store.querySealingList(queryParams);
                    setIds([]);
                    setSelectedRowKeys([]);
                },
            });
        } catch (error) {
            console.log(error);
        }
    };

    const handelDelect = () => {
        if (!ids.length) return message.error('请勾选需要批量删除的数据');
        try {
            Modal.confirm({
                title: '确定批量删除吗？',
                onOk () {
                    batchDeleteSealingControl(ids).then(res => {
                        searchinput.current.input.input.value=''
                        searchinput.current.input.state.value=''
                        message.success(res);
                        store.querySealingList({ ...queryParams, page: 1,keyWord:'' });
                        setIds([]);
                        setSelectedRowKeys([]);
                    })

                },
            });
        } catch (error) {
            console.log(error);
        }
    }

    const EditableCell = ({ editing, dataIndex, title, inputType, record, index, children, ...restProps }) => {
        // const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
        const inputNode = <InputNumber />;
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

    const isEditing = (record) => record.key === editingKey;

    const edit = (record) => {
        form.setFieldsValue({
            ...record,
        });
        setEditingKey(record.key);
    };

    const cancel = () => {
        setEditingKey('');
    };

    const save = async (key) => {
        try {
            const row = await form.validateFields();
            const newData = [...store.sealingList];
            const index = newData.findIndex((item) => key === item.key);

            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, { ...item, ...row });
                await store.savePeople({ ...row, id: newData[index].id });
                store.querySealingList(queryParams);
                setEditingKey('');
            }
            // else {
            //   newData.push(row);
            //   setData(newData);
            //   setEditingKey('');
            // }
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
                inputType: record.inputType,
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    // 保存左边点
    const saveDrawData = async (data) => {
        setSpinStatus(true);
        try {
            await store.saveDrawData({
                ...data,
            });
            setSpinStatus(false);
            setMapOpenStatus(false);
            setMapData();
            store.querySealingList(queryParams);
        } catch (error) {
            message.error('无数据可提交');
            setSpinStatus(false);
        }
    };

    const getPermission = () => {
        let data = verificationPath();
        let arr = {};
        data?.forEach((i) => {
            arr[i.code] = true;
        });
        setPermissionData(arr);
    };

    const paginationOnChange = () =>{
        setIds([]);
        setSelectedRowKeys([]);
    };

    useEffect(() => {
        store.querySealingList(queryParams);
    }, [queryParams]);

    useEffect(() => {
        getPermission();
        store.getAreaList();
        store.sealingType();
    }, []);
    return (
        <div className={styles.packet_control}>
            <div className={styles.step}>
                <Steps current={stepStatus}>
                    {stepsList.map((item) => (
                        <Steps.Step title={item.title} />
                    ))}
                </Steps>
            </div>

            <div className={styles.table_list}>
                <div className={styles.search_form}>
                    <div className={styles.btns}>
                        <Button style={{ display: permissionData.DataImport ? 'inline-block' : 'none' }} icon={<PlusOutlined />} type='primary' onClick={() => setVisible(true)}>
                            导入封控区数据
                        </Button>
                        <Button icon={<RetweetOutlined />} style={{ display: permissionData.DataWarehous ? 'inline-block' : 'none' }} type='info' onClick={batchStorage}>
                            批量入库
                        </Button>
                        <Button icon={<DeleteOutlined />} style={{ display: permissionData.DataBatchDelect ? 'inline-block' : 'none' }} type='info' onClick={handelDelect}>
                            批量删除
                        </Button>
                    </div>
                    <Form name='basic' className='form-demo-basic' form={searchFrom} layout='inline' onValuesChange={formChange}>
                        <Form.Item name='area'>
                            <Select placeholder='请选择所在行政区' allowClear style={{ width: 194 }}>
                                {store?.areaList?.map((item) => (
                                    <Option value={item} key={item}>
                                        {item}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item>
                            <Input.Search
                               ref={searchinput}
                                onSearch={(value) => setQueryParams({ ...queryParams, keyWord: value })}
                                placeholder='搜索'
                            />
                        </Form.Item>

                        <Form.Item name='sealingType'>
                            <Select placeholder='请选择封控类型' allowClear style={{ width: 194 }}>
                                {store?.sealingTypeList?.map((item) => (
                                    <Option value={item} key={item}>
                                        {item}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item name='isExist'>
                            <Select style={{ width: 194 }} allowClear placeholder='是否增量'>
                                <Option value={0}>增量</Option>
                                <Option value={1}>存量</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name='sealingDate' initialValue={moment().subtract('days')}>
                            <DatePicker allowClear={false} style={{ width: 240 }} />
                        </Form.Item>
                    </Form>
                </div>
                <Form form={form} component={false}>
                    <Table
                        components={{
                            body: {
                                cell: EditableCell,
                            },
                        }}
                        loading={store.loading}
                        dataSource={store.sealingList}
                        columns={mergedColumns}
                        rowClassName='editable-row'
                        pagination={{ showSizeChanger: true, showQuickJumper: true, showTotal: (total) => `共 ${total} 条` ,onChange: () => { paginationOnChange() }}}
                        rowSelection={rowSelection}
                        scroll={{ x: 'max-centent', y: 'calc(100vh - 56px - 64px - 96px - 200px)' }}
                        rowKey='id'
                    />
                </Form>
            </div>
            <UpFileModal visible={visible} setVisible={setVisible} getList={(date) => { setQueryParams({ ...queryParams, sealingDate: date }); searchFrom.setFieldsValue({ sealingDate: moment(date, 'YYYY/MM/DD') }) }} />
            {mapOpenStatus && (
                <Map
                    visible={mapOpenStatus}
                    saveDrawData={saveDrawData}
                    setMapData={setMapData}
                    poiSearch={store.poiSearch}
                    handleCancel={() => setMapOpenStatus(false)}
                    spinStatus={spinStatus}
                    mapData={mapData}
                    theme={theme}
                    drawAreaTabStatus
                    drawPointTabStatus
                    drawPointStatus
                    drawPolygonStatus
                    markerLayerStatus
                    typeList={typeList}
                    markerData={[]}
                    showModal
                    scale={1}
                />
            )}
        </div>
    );
};

export default observer(PacketControl);
