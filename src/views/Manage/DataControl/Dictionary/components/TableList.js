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
import TreeModal from './tree'
import AddModal from './AddModal'

const TableList = ({ permissionData }) => {
    const [editingKey, setEditingKey] = useState('');
    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);
    const [addVisible, setAddVisible] = useState(false);
    const [rowInfo, setRowInfo] = useState({});

    const [typeObj, setTypeObj] = useState({
        1: '业务',
        2: '系统'
    });
    const [parentId, setParentId] = useState(null);


    const store = useStore('dictionary');

    const deleteItem = ({ id }) => {
        console.log(id)
        Modal.confirm({
            title: '确定删除吗?',
            className: styles.confirm_wrap,
            async onOk () {
                try {
                    await store.deleteItem([id]);
                    message.success('删除成功');
                    await store.regionsPageList()
                } catch (error) {
                    console.log(error);
                }
            }
        });
    }

    const editItem = (row) => {
        setAddVisible(true)
        setRowInfo({ ...row, update: true, key: row.id })
    };


    const handleTree = (row) => {
        setVisible(true)
        setParentId(row.id)
    }

    const rowAdd = (row) => {
        setAddVisible(true)
        setRowInfo({ ...row, update: false, key: row.id })
    }
    const getUrlParams2 = () => {
        let urlStr = window.location.href.split('?')[1]
        const urlSearchParams = new URLSearchParams(urlStr)
        const result = Object.fromEntries(urlSearchParams.entries())
        return result
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
            width: 120,
            render: (text) => <>{text || '-'}</>
        },
        {
            title: '字典编码',
            dataIndex: 'parentCode',
            key: 'parentCode',
            width: 120,
            render: (text) => <>{text || '-'}</>
        },
        {
            title: '字典项名称',
            dataIndex: 'childrenName',
            key: 'childrenName',
            width: 120,
            render: text => <>{text || '-'}</>
        },
        {
            title: '字典项编码',
            dataIndex: 'childrenCode',
            key: 'childrenCode',
            width: 120,
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
            title: '是否可用',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            render: text => <>{text ? '否' : '是'}</>
        },
        {
            title: '介绍',
            dataIndex: 'details',
            key: 'details',
            width: 120,
            render: text => <>{text || '-'}</>
        },
        {
            title: '父级',
            dataIndex: 'parentIdName',
            key: 'parentIdName',
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
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            width: 200,
            align:'center',
            fixed: 'right',
            render: (_, record) => {
                return (
                    <>
                        <Button type='link' onClick={() => editItem(record)}>
                            修改
                        </Button>
                        <Button type='link' onClick={() => deleteItem(record)}>
                            删除
                        </Button>

                        <Button type='link' style={{ display: record.haveTree ? 'inline-block' : 'none', }} onClick={() => handleTree(record)}>
                            子集树
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
        store.update({
            pagination: pageObj
        });
        store.regionsPageList();
    }

    useEffect(() => {
        store.regionsPageList();
    }, [store.requestParama]);

    return (
        <>
            <Form form={form} component={false}>
                <Table
                    loading={store.loading}
                    dataSource={store.tableData || []}
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
            <TreeModal visible={visible} setVisible={setVisible} id={parentId} />
        </>
    )
}
export default observer(TableList);
