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
import AddModal from './AddModal'
import { getType } from '@turf/turf';

const TableList = ({ permissionData }) => {
    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);
    const [addVisible, setAddVisible] = useState(false);
    const [rowInfo, setRowInfo] = useState({});


    const store = useStore('configconst');

    const deleteItem = ({ id }) => {
        console.log(id)
        Modal.confirm({
            title: '确定删除吗?',
            className: styles.confirm_wrap,
            async onOk () {
                try {
                    await store.deleteItem([id]);
                    message.success('删除成功');
                    await store.listPage()
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
    const getType = (text) => {
        return store?.typeObj[text]
    }

    const columns = [
        {
            title: '主键id',
            dataIndex: 'id',
            key: 'id',
            width: 80,
        },
        {
            title: '应用类别',
            dataIndex: 'type',
            key: 'type',
            width: 80,
            render: text => <>{getType(text) || '-'}</>
        },
        {
            title: '配置key',
            dataIndex: 'configkey',
            key: 'configkey',
            width: 120,
            render: text => <>{text || ''}</>
        },
        {
            title: '配置value',
            dataIndex: 'configvalue',
            key: 'configvalue',
            width: 120,
            render: text => <>{text || ''}</>
        },
        {
            title: '业务介绍',
            dataIndex: 'describe',
            key: 'describe',
            width: 120,
            render: text => <>{text || '-'}</>
        },
        {
            title: '扩展字段',
            dataIndex: 'ex',
            key: 'ex',
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
            title: '更新时间',
            dataIndex: 'updateTime',
            key: 'updateTime',
            width: 160,
            render: text => <>{text || '-'}</>
        },
        {
            title: '创建人',
            dataIndex: 'createUser',
            key: 'createUser',
            width: 160,
            render: text => <>{text || '-'}</>
        },
        {
            title: '修改人',
            dataIndex: 'updateUser',
            key: 'updateUser',
            width: 130,
            render: text => <>{text || '-'}</>
        },

        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            width: 200,
            align: 'center',
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
                    </>
                );
            },
        },
    ];

    const changePage = (pageObj) => {
        store.update({
            pagination: pageObj
        });
        store.listPage();
    }

    useEffect(() => {
        store.queryDictionaryList(
            { parentCode: 'DICT_YML' }
        )
    }, []);

    useEffect(() => {
        store.listPage();
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
        </>
    )
}
export default observer(TableList);
