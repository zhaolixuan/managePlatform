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
import { DeleteOutlined } from '@ant-design/icons';
import { batchDeleteSupplyChain } from '@/api/stockSellStorage'
import moment from 'moment';
import { useEffect, useState, useHistory } from 'react';
import { observer } from 'mobx-react';
import { useStore, useRouter } from '@/hooks';
import { toJS } from 'mobx';
import AddModal from './AddModal';
import ShowMoreModal from '@/components/GisMap/components/Popup/showMoreModal';
import styles from './index.module.less';
import { verificationPath } from '@/utils/Permission';

const StockSellStorage = () => {
    const { history } = useRouter();
    const params = history.location.search.split('?name=')[1].split('&id=')
    const businessName = decodeURI(params[0])
    const businessId = params[1].split('&businessType=')[0]
    const businessType = Number(history.location.search.split('?name=')[1].split('&businessType=')[1])
    const { RangePicker } = DatePicker;
    const [visible, setVisible] = useState(false);
    const [showMoreVisible, setShowMoreVisible] = useState(false);
    // 新增/编辑/查看更多
    const [title, setTitle] = useState('新增');
    // 统计时间
    const [reportDate, setReportDate] = useState();
    const [ids, setIds] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const store = useStore('stockSellStorage');
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
            title: '确定删除吗?',
            className: styles.confirm_wrap,
            async onOk () {
                try {
                    await store.deleteItem(item.id);
                    message.success('删除成功');
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
        // {
        //   title: '场所名称',
        //   dataIndex: 'businessName',
        //   key: 'businessName',
        //   width: 180,
        //   fixed: 'left',
        //   render: text => <Tooltip title={text}>
        //     <div className={styles.businessName}>
        //       {text}
        //     </div>
        //   </Tooltip>
        // },
        {
            title: '主食进货量（公斤）',
            dataIndex: 'staplePurchase',
            key: 'staplePurchase',
            width: 100,
            editable: true,
            inputType: 'input',
        },
        {
            title: '主食销售量（公斤）',
            dataIndex: 'stapleSale',
            key: 'stapleSale',
            width: 120,
            editable: true,
            inputType: 'input',
        },
        {
            title: '主食库存量（公斤）',
            dataIndex: 'stapleInventory',
            key: 'stapleInventory',
            width: 100,
            editable: true,
            inputType: 'input',
        },
        {
            title: '副食进货量（公斤）',
            dataIndex: 'subsidiaryPurchase',
            key: 'subsidiaryPurchase',
            width: 100,
            editable: true,
            inputType: 'input'
        },
        {
            title: '副食销售量（公斤）',
            dataIndex: 'subsidiarySale',
            key: 'subsidiarySale',
            width: 100,
            editable: true,
            inputType: 'input'
        },
        {
            title: '副食库存量（公斤）',
            dataIndex: 'subsidiaryInventory',
            key: 'subsidiaryInventory',
            width: 100,
            editable: true,
            inputType: 'input'
        },
        {
            title: '蔬菜进货量（公斤）',
            dataIndex: 'vegetableFruitPurchase',
            key: 'vegetableFruitPurchase',
            width: 150,
            editable: true,
            inputType: 'input'
        },
        {
            title: '蔬菜销售量（公斤）',
            dataIndex: 'vegetableFruitSale',
            key: 'vegetableFruitSale',
            width: 150,
            editable: true,
            inputType: 'input'
        },
        {
            title: '蔬菜库存量（公斤）',
            dataIndex: 'vegetableFruitInventory',
            key: 'vegetableFruitInventory',
            width: 150,
            editable: true,
            inputType: 'input'
        },
        {
            title: '水果进货量（公斤）',
            dataIndex: 'fruitPurchase',
            key: 'fruitPurchase',
            width: 150,
            editable: true,
            inputType: 'input'
        },
        {
            title: '水果销售量（公斤）',
            dataIndex: 'fruitSale',
            key: 'fruitSale',
            width: 150,
            editable: true,
            inputType: 'input'
        },
        {
            title: '水果库存量（公斤）',
            dataIndex: 'fruitInventory',
            key: 'fruitInventory',
            width: 150,
            editable: true,
            inputType: 'input'
        },
        
        {
            title: '订单数量（单）',
            dataIndex: 'orderNum',
            key: 'orderNum',
            width: 150,
            editable: true,
            inputType: 'input'
        },
        {
            title: '统计时间',
            dataIndex: 'enteringTime',
            key: 'enteringTime',
            width: 100,
            editable: false,
            inputType: 'input'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          key: 'createTime',
          width: 100,
          editable: false,
          inputType: 'input'
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
                        <Button style={{ display: permissionData.StockEdit ? 'inline-block' : 'none', }} type='link' onClick={() => edit(record)}>
                            编辑
                        </Button>
                        <Button style={{ display: permissionData.StockDelect ? 'inline-block' : 'none', }} type='link' onClick={() => deleteItem(record)}>
                            删除
                        </Button>
                        <Button style={{ display: permissionData.StocksellstorageCheck ? 'inline-block' : 'none', }} type='link' onClick={() => showMore(record)}>
                            查看更多
                        </Button>
                    </>
                );
            },
        },
    ];

    // 选择的数据
    const changeSelect = (record, selectedRows) => {
        setSelectedRowKeys(selectedRows.map((item) => item.id));
        const idsArr = selectedRows.map((item) => item.id);
        setIds(idsArr);
    };

    // 全选/非全选
    const onSelectAll = (selected) => {
        console.log(selected, 2);
        setSelectedRowKeys(selected ? store?.sealingList.map(item => item.key) : []);
        const idsArr = store?.sealingList.map(item => item.id);
        setIds(idsArr);
    }

    const rowSelection = {
        type: 'checkbox',
        onChange: changeSelect,
        getCheckboxProps: (record) => ({
            ...record,
            //   disabled: record.status * 1 !== 0,
        }),
        selectedRowKeys,
        onSelectAll
    };

    const handelDelect = () => {
        if (!ids.length) return message.error('请勾选需要批量删除的数据');

        try {
            Modal.confirm({
                title: '确定批量删除吗？',
                onOk () {
                    batchDeleteSupplyChain(ids).then(async res => {
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

    // 当赛选条件发生改变是调用列表接口
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
                        rules={dataIndex === 'orderNum' ? [
                            {
                                required: false, whitespace: true, type: 'number',
                                transform (value) { if (value) { return Number(value) } }, message: `请输入有效${title}`
                            }
                        ] : [
                            // {
                            //   required: true,
                            //   message: `请输入 ${title}!`,
                            // },
                            {
                                required: true, whitespace: true, type: 'number',
                                transform (value) { if (value) { return Number(value) } }, message: `请输入有效${title}`
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
    const cancel = () => {
        setEditingKey('');
    };

    // 表格编辑
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
        // console.log(toJS(data),'可显示功能');
        data.forEach((i) => {
            arr[i.code] = true;
        });
        setPermissionData(arr);
    };

    useEffect(() => {
      if(visible) return;
        getPermission();
        store.getSupplyChainList(queryParams);
        // store.sealingType();
    }, [visible]);

    // 新增
    const add = () => {
      setTitle('新增')
      setVisible(true);
      setReportDate('')
    };
    // 编辑
    const edit = (record) => {
      setReportDate(record.enteringTime)
      setTitle('编辑')
      setVisible(true)
    };
    // 查看更多
    const showMore = (record) => {
      setReportDate(record.enteringTime)
      setShowMoreVisible(true)
    };

    return (
        <div className={styles.site}>
            <div className={styles.table_list}>
                <div className={styles.search_form}>
                    <div className={styles.btns}>
                        {/* <Button type='primary' onClick={() => setVisible(true)}>
              批量导入
            </Button> */}
                        <Button style={{ display: permissionData.StockAdd ? 'inline-block' : 'none', }} type='primary' onClick={add}>
                            新增
                        </Button>
                        <Button icon={<DeleteOutlined />} style={{ display: permissionData.StockBatchDelect ? 'inline-block' : 'none' }} type='info' onClick={handelDelect}>
                            批量删除
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
                        rowClassName='editable-row'
                        pagination={store.pagination}
                        scroll={{ x: 'max-centent', y: '400px' }}
                        rowKey='id'
                        rowSelection={rowSelection}
                    />
                </Form>
            </div>
            <AddModal title={title} visible={visible} businessId={businessId} businessType={businessType} reportDate={reportDate} name={businessName} setVisible={setVisible}/>
            <ShowMoreModal visible={showMoreVisible} businessId={businessId} businessType={businessType} reportDate={reportDate} name={businessName} setVisible={setShowMoreVisible} showMore={true}/>
        </div>
    );
};

export default observer(StockSellStorage);
