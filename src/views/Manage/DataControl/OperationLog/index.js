import store from '@/store';
import { Table, Form, Input, Button, DatePicker, Row, Col } from '@jd/find-react';
import { observer } from 'mobx-react';
import { useStore } from '@/hooks';
import moment from 'moment';
import AddModal from './components/addModal'
import styles from './index.module.less'
import { useEffect, useState } from 'react';

const OperationLog = () => {
    const store = useStore('operationLog');
    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);

    const showDetail = async ({ id }) => {
        setVisible(true);
        const res = await store.getDetail({ id });
        console.log(res);
    };

    const columns = [
        {
            title: '分类',
            dataIndex: 'logType',
            key: 'logType',
            fixed: 'left',
            width: 250
        },
        {
            title: '接口名称',
            dataIndex: 'logName',
            key: 'logName',
            fixed: 'left',
            width: 250
        },
        {
            title: '请求url',
            dataIndex: 'requestUrl',
            key: 'requestUrl',
            fixed: 'left',
            width: 250
        },
        {
            title: '方法路径',
            dataIndex: 'javaMethodPath',
            key: 'javaMethodPath',
            width: 150
        },
        {
            title: '自定义日志内容',
            dataIndex: 'logContent',
            key: 'logContent',
            width: 150
        },
        {
            title: '服务器ip',
            dataIndex: 'serverIp',
            key: 'serverIp',
            width: 150
        },
        {
            title: '客户端ip',
            dataIndex: 'clientIp',
            key: 'clientIp',
            width: 150
        },
        {
            title: '用户id',
            dataIndex: 'userId',
            key: 'userId',
            width: 150
        },
        {
            title: '请求方法',
            dataIndex: 'httpMethodType',
            key: 'httpMethodType',
            width: 150
        },
        {
            title: '客户浏览器标识',
            dataIndex: 'clientBrowser',
            key: 'clientBrowser',
            width: 150
        },
        {
            title: '客户操作系统',
            dataIndex: 'clientOs',
            key: 'clientOs',
            width: 150
        },
        {
            title: '请求时间',
            dataIndex: 'requestTime',
            key: 'requestTime',
            width: 150
        },
        {
            title: '结束请求时间',
            dataIndex: 'createTime',
            key: 'createTime',
            width: 150
        },
        {
            title: '耗时(ms)',
            dataIndex: 'consuming',
            key: 'consuming',
            width: 150
        },
        {
            title: '操作',
            dataIndex: 'active',
            key: 'active',
            render: (_, item) => <Button type='link' onClick={() => showDetail(item)}>详情</Button>
        },
    ];

    const search = async () => {
        try {
            const values = await form.validateFields();
            store.update({
                pagination: {
                    pageSize: 10,
                    current: 1,
                    total: 0,
                }
            });
            values && store.update({
                requestParama: {
                    ...store.requestParama,
                    ...values,
                    requestTimeEnd: values?.date ? moment(values?.date[1]).format('YYYY-MM-DD HH:mm:ss') : '',
                    requestTimeFrom: values?.date ? moment(values?.date[0]).format('YYYY-MM-DD HH:mm:ss') : '',
                    // requestTimeEnd: values?.date[1] || '',
                    // requestTimeFrom: values?.date[0] || '',
                }
            });
        } catch (error) {
            console.log(error);
        }
    }

    const changePage = (pageObj) => {
        store.update({
            pagination: pageObj
        });
        store.getList({
            ...store.requestParama,
            ...pageObj,
            page: pageObj.current
        });
    }

    useEffect(() => {
        store.getList();
    }, [store.requestParama]);
    return (
        <div className={styles.operation_log}>
            <div className={styles.top}>
                <Row gutter={[16, 48]}>
                    <Form
                        name="basic"
                        className={styles.search_form}
                        layout='inline'
                        form={form}
                    >
                        <Col className="gutter-row" span={6}>
                            <Form.Item
                                label="方法路径"
                                name="javaMethodPathLike"
                            >
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col className="gutter-row" span={6}>
                            <Form.Item
                                label="日志名称"
                                name="logNameLike"
                            >
                                <Input />
                            </Form.Item>

                        </Col>


                        <Col className="gutter-row" span={6}>
                            <Form.Item
                                label="耗时(ms)大于"
                                name="consumingGt"
                                rules={[{ pattern: /^(-?\d+)(\.\d+)?$/, message: '请输入正确的毫秒值' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>


                        <Col className="gutter-row" span={6}>
                            <Form.Item
                                label="http或方法的请求参数体"
                                name="requestParamsLike"
                            >
                                <Input />
                            </Form.Item>
                        </Col>


                        <Col className="gutter-row" span={6}>
                            <Form.Item
                                label="http或方法的请求结果"
                                name="requestResultLike"
                            >
                                <Input />
                            </Form.Item>
                        </Col>


                        <Col className="gutter-row" span={6}>
                            <Form.Item
                                label="当前用户请求的url"
                                name="requestUrlLike"
                            >
                                <Input />
                            </Form.Item>
                        </Col>


                        <Col className="gutter-row" span={8}>
                            <Form.Item
                                label="请求时间"
                                name="date"
                            >
                                <DatePicker.RangePicker showTime />
                            </Form.Item>
                        </Col>

                        <Col className="gutter-row" span={2}>
                            <Form.Item
                            >
                                <Button type='primary' onClick={search}>搜索</Button>
                            </Form.Item>
                        </Col>

                    </Form>
                </Row>

            </div>
            <Table
                dataSource={store.tableData}
                loading={store.loading}
                pagination={{
                    ...store.pagination,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showLessItems: true,
                    showTotal: (total) => `共 ${total} 条`
                }}
                scroll={{ x: 'max-content', y: 'calc(100vh - 410px)' }}
                onChange={changePage}
                columns={columns} />

            <AddModal visible={visible} onCancel={() => store.update({ datails: {} })} details={store.details} setVisible={setVisible} />

        </div>
    )
};

export default observer(OperationLog);
