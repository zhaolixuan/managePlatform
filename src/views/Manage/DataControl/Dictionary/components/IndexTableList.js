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
import { useStore, useRouter } from '@/hooks';
import styles from '../index.module.less';
import AddModal from './IndexAddModal'

const TableList = ({ permissionData }) => {
    const [editingKey, setEditingKey] = useState('');
    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);
    const [addVisible, setAddVisible] = useState(false);
    const [rowInfo, setRowInfo] = useState({});
    const { history } = useRouter();
    const [typeObj, setTypeObj] = useState({
        1: '业务',
        2: '系统'
    });


    const store = useStore('dictionary');

    const editItem = (row) => {
        setAddVisible(true)
        setRowInfo({ ...row, update: true, key: row.id })
    };

    const cheackItem = (row) => {
        store.update({
            pagination: {
                pageSize: 10,
                current: 1,
                total: 0,
            }
        })
        history.push({ pathname: '/manage/dict/list/detail', search: `?parentName=${row.parentName}&parentCode=${row.parentCode}&type=${row.type}` })
    };

    const handleTree = (row) => {
        setVisible(true)
        setParentId(row.id)
    }

    const rowAdd = (row) => {
        setAddVisible(true)
        setRowInfo({ ...row, update: false, key: row.id })
    }

    const columns = [
        {
            title: '编号',
            dataIndex: 'index',
            key: 'index',
            width: '60px',
            render: (text, record, index) => <>{(store.pagination.current - 1) * store.pagination.pageSize + index + 1 || '-'}</>,
        },
        {
            title: '字典名称',
            dataIndex: 'parentName',
            key: 'parentName',
            width: 170,
            render: text => <>{text || '-'}</>
        },
        {
            title: '字典编码',
            dataIndex: 'parentCode',
            key: 'parentCode',
            width: 170,
            render: text => <>{text || '-'}</>
        },
        {
            title: '类型',
            dataIndex: 'type',
            key: 'type',
            width: 80,
            render: text => <>{typeObj[text] || '-'}</>
        },
        {
            title: '介绍',
            dataIndex: 'details',
            key: 'details',
            width: 120,
            render: text => <>{text || '-'}</>
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            width: 160,
            render: text => <>{text || '-'}</>
        },
        {
            title: '是否可用',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            render: text => <>{text ? '否' : '是'}</>
        },

        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            width: 200,
            align:'center',
            fixed: 'right',
            render: (_, record) => {
                return (
                    <>
                        {/* <Button type='link' onClick={() => rowAdd(record)}>
                            新增
                        </Button> */}
                        <Button type='link' onClick={() => editItem(record)}>
                            修改
                        </Button>
                        <Button type='link' onClick={() => cheackItem(record)}>
                            查看
                        </Button>
                    </>
                );
            },
        },
    ];


    // const cancel = () => {
    //   setEditingKey('');
    //   store.update({
    //     streetList: []
    //   });
    // };

    const changePage = (pageObj) => {
        console.log(pageObj);
        store.update({
            pagination: pageObj
        });
        store.queryDictionaryGroupByParentCodeList();
    }

    useEffect(() => {
        store.update({
            pagination: {
                pageSize: 10,
                current: 1,
                total: 0,
            }
        })
        store.queryDictionaryGroupByParentCodeList();
    }, [store.requestParama]);

    return (
        <>
            <Form form={form} component={false}>
                <Table
                    loading={store.loading}
                    dataSource={store.IndextableData || []}
                    columns={columns}
                    rowClassName='editable-row'
                    pagination={{ ...store.pagination, showSizeChanger: true, showQuickJumper: true, showLessItems: true, showTotal: (total) => `共 ${total} 条` }}
                    // rowSelection={rowSelection}
                    onChange={changePage}
                    scroll={{ x: 'max-centent', y: '620px' }}
                    rowKey='id'
                    on
                />
            </Form>
            <AddModal visible={addVisible} setVisible={setAddVisible} rowInfo={rowInfo} />
        </>
    )
}
export default observer(TableList);
