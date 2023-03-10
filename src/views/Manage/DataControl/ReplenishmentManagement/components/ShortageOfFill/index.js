/* eslint-disable no-restricted-globals */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-use-before-define */
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
    Pagination
} from '@jd/find-react';
import moment from 'moment';
import { useEffect, useState, useHistory } from 'react';
import { observer } from 'mobx-react';
import { useStore, useRouter } from '@/hooks';
import AddModal from './AddModal';
import styles from './index.module.less';
import { verificationPath } from '@/utils/Permission';
import { DeleteOutlined } from '@ant-design/icons';
import {  batchDelete } from '@/api/shortageOfFill';

const ShortageOfFill = () => {
    const { history } = useRouter();
    const params = history.location.search.split('?name=')[1].split('&id=')
    const businessName = decodeURI(params[0])
    const businessId = params[1]
    const { RangePicker } = DatePicker;
    const [visible, setVisible] = useState(false);
    const [ids, setIds] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const store = useStore('shortageOfFill');
    const [queryParams, setQueryParams] = useState({
        endTime: '',
        startTime: '',
        page: store.pagination.page,
        pageSize: store.pagination.pageSize,
        businessName,
        businessId
    });
    const [form] = Form.useForm();
    const [searchFrom] = Form.useForm();
    const [editingKey, setEditingKey] = useState('');
    const [permissionData, setPermissionData] = useState({});

    const tableSelect = {
        siteTypeList: [
            { value: 'jack', label: 'Jack' },
            { value: 'lucy', label: 'Lucy' },
            { value: 'Disabled', label: 'disabled', disabled: true },
            { value: 'other', label: 'other', Age: 12, Score: 100 },
        ],
        administrativeList: [
            { value: 'jack', label: 'Jack' },
            { value: 'lucy', label: 'Lucy' },
        ],
    };

    const deleteItem = (item) => {
        Modal.confirm({
            title: '????????????????',
            className: styles.confirm_wrap,
            async onOk () {
                try {
                    await store.deleteItem(item.id);
                    message.success('????????????');
                    await store.getSupplyChainList(queryParams)
                } catch (error) {
                    console.log(error);
                }
            }
        });
    }

    const handleAddItem = () => {
        store.getSupplyChainList(queryParams);
    }

    const changePage = (pageObj) => {
        store.updatePage({
            pagination: pageObj
        });
        console.log(pageObj, 'pageObj')
        setQueryParams({ ...queryParams, page: pageObj.current, pageSize: pageObj.pageSize })
    }

    const columns = [
        {
            title: '????????????',
            dataIndex: 'businessName',
            key: 'businessName',
            width: 180,
            fixed: 'left',
            // editable: true,
            // inputType: 'input',
            render: text => <Tooltip title={text}>
                <div className={styles.businessName}>
                    {text}
                </div>
            </Tooltip>
        },
        {
            title: '???????????????????????????',
            dataIndex: 'stapleReplenishment',
            key: 'stapleReplenishment',
            width: 100,
            editable: true,
            inputType: 'input',
        },
        {
            title: '???????????????????????????',
            dataIndex: 'subsidiaryReplenishment',
            key: 'subsidiaryReplenishment',
            width: 120,
            editable: true,
            inputType: 'input',
        },
        {
            title: '???????????????????????????',
            dataIndex: 'vegetableReplenishment',
            key: 'vegetableReplenishment',
            width: 100,
            editable: true,
            inputType: 'input',
        },
        {
            title: '???????????????????????????',
            dataIndex: 'fruitReplenishment',
            key: 'fruitReplenishment',
            width: 100,
            editable: true,
            inputType: 'input'
        },
        {
            title: '????????????',
            dataIndex: 'enteringTime',
            key: 'enteringTime',
            width: 100,
            editable: false,
            inputType: 'input'
        },

        {
            title: '??????',
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
                            ??????
                        </Button>
                        <Button onClick={cancel}>??????</Button>
                    </div>
                ) : (
                    <>
                        <Button type='link' style={{ display: permissionData.OfFllEdit ? 'inline-block' : 'none' }} onClick={() => edit(record)}>
                            ??????
                        </Button>
                        <Button type='link' style={{ display: permissionData.OfFllDelect ? 'inline-block' : 'none' }} onClick={() => deleteItem(record)}>
                            ??????
                        </Button>
                    </>
                );
            },
        },
    ];

    // ???????????????
    const changeSelect = (record, selectedRows) => {
        setSelectedRowKeys(selectedRows.map((item) => item.id));
        const idsArr = selectedRows.map((item) => item.id);
        setIds(idsArr);
    };

    // ??????/?????????
    const onSelectAll = (selected) => {
        setSelectedRowKeys(selected ? store?.sealingList.map(item => item.id) : []);
        const idsArr = store?.sealingList.map(item => item.id);
        setIds(idsArr);
    }

    const handelDelect = () => {
        if (!ids.length) return message.error('????????????????????????????????????');
        try {
            Modal.confirm({
                title: '????????????????????????',
                onOk () {
                    batchDelete(ids).then(async res => {
                        message.success(res);
                        await store.getSupplyChainList({...queryParams,page: 1});
                        setIds([]);
                        setSelectedRowKeys([]);
                    })

                },
            });
        } catch (error) {
            console.log(error);
        }
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

    // ????????????????????????????????????????????????
    const formChange = (_, values) => {
        setQueryParams({
            ...queryParams,
            ...values
        });
    };

    const EditableCell = ({
        editing,
        dataIndex,
        title,
        inputType,
        record,
        index,
        children,
        selectData,
        ...restProps
    }) => {
        const inputNodeList = {
            number: <InputNumber />,
            input: <Input />,
            select: <Select options={tableSelect[selectData] || []} />,
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
                            // {
                            //   required: true,
                            //   message: `????????? ${title}!`,
                            // },
                            {
                                required: true, whitespace: true, type: 'number',
                                transform (value) { if (value) { return Number(value) } }, message: `???????????????${title}`
                            }
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

    const isEditing = (record) => record.id === editingKey;

    const edit = (record) => {
        form.setFieldsValue({
            ...record,
        });
        setEditingKey(record.id);
    };

    const cancel = () => {
        setEditingKey('');
    };

    // ????????????
    const save = async (key) => {
        try {
            const row = await form.validateFields();
            const newData = [...store.supplyChainList];
            const index = newData.findIndex((item) => key === item.id);
            console.log(index, newData, key, 'index')
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, { ...item, ...row });
                console.log(row, 'rowrowrow')
                await store.update({ ...row, id: newData[index].id, enteringTime: moment().format('YYYY-MM-DD HH:ss:mm') });
                store.getSupplyChainList(queryParams);
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    const handlePicker = (date, dateString) => {
        console.log(date, dateString)
        setQueryParams({ ...queryParams, startTime: dateString[0], endTime: dateString[1] })
    }

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
                editing: isEditing(record),
            })
        };
    });

    useEffect(() => {
        store.getSupplyChainList(queryParams);
    }, [queryParams]);

    const getPermission = () => {
        let data = verificationPath();
        let arr = {};
        data.forEach((i) => {
            arr[i.code] = true;
        });
        setPermissionData(arr);
    };
    useEffect(() => {
        getPermission();
        store.getSupplyChainList(queryParams);
        // store.sealingType();
    }, []);
    return (
        <div className={styles.site}>
            <div className={styles.table_list}>
                <div className={styles.search_form}>
                    <div className={styles.btns}>
                        {/* <Button type='primary' onClick={() => setVisible(true)}>
              ????????????
            </Button> */}
                        <Button style={{ display: permissionData.OfFllAdd ? 'inline-block' : 'none' }} type='primary' onClick={() => setVisible(true)}>
                            ??????
                        </Button>
                        <Button icon={<DeleteOutlined />} style={{ display: permissionData.OfFllBatchDelect ? 'inline-block' : 'none' }} type='info' onClick={handelDelect}>
                            ????????????
                        </Button>
                    </div>
                    <Form name='basic' className='form-demo-basic' form={searchFrom} layout='inline' onValuesChange={formChange}>
                        <Form.Item>
                            <RangePicker onChange={handlePicker} />
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
                        dataSource={store.supplyChainList}
                        columns={mergedColumns}
                        onChange={changePage}
                        rowSelection={rowSelection}
                        rowClassName='editable-row'
                        pagination={store.pagination}
                        scroll={{ x: 'max-centent', y: '400px' }}
                        rowKey='id'
                    />
                </Form>
            </div>
            <AddModal visible={visible} name={businessName} businessId={businessId} handleAddItem={handleAddItem} setVisible={setVisible} />
        </div>
    );
};

export default observer(ShortageOfFill);
