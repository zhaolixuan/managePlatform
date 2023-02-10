/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'
import { Modal, Form, Input, Select, Row, Col, message, AutoComplete, Button, notification, Tooltip, Switch } from '@jd/find-react';

import { observer } from 'mobx-react';
import { useStore } from '@/hooks';
import ModalFooter from '@/views/Manage/componets/ModalFooter';
import styles from './AddModal.module.less'
const { Option } = Select;


const AddModal = ({ visible, setVisible, rowInfo }) => {
    const [form] = Form.useForm();
    const store = useStore('configconst');
    const [update, setUpdate] = useState(false);

    useEffect(() => {
        if (rowInfo) {
            form.setFieldsValue({
                configkey: rowInfo.configkey,
                configvalue: rowInfo.configvalue,
                type: rowInfo.type + '',
                describe: rowInfo.describe,
                ex: rowInfo.ex
            })
        }
    }, [rowInfo]);

    useEffect(() => {
        if (rowInfo) {
            setUpdate(true)

        } else {
            setUpdate(false)

        }
    }, [visible]);


    const onCancel = () => {
        setVisible(false);
        form.resetFields();
    }


    const onOk = () => {
        form.validateFields().then(async values => {
            try {
                if (rowInfo?.update) { //修改
                    await store.saveOrUpdate({ ...rowInfo, ...values })
                } else { // 新增
                    await store.saveOrUpdate({ ...values })
                }
                setVisible(false);
                store.listPage();
                form.resetFields();
            } catch (error) {
                console.log(error);
            }


        })
    }

    return (
        <Modal

            title={rowInfo?.update ? '修改' : '新增'}
            visible={visible}
            onOk={onOk}
            onCancel={onCancel}
            width='70%'
            className={styles.add_modal}
            footer={null}
            destroyOnClose
        >
            <Form
                name='basic'
                className={styles['form-demo-basic']}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
                form={form}
            >
                <Form.Item
                    label='应用类别'
                    name='type'
                    rules={[{ required: true, message: '请选择应用类别' }]}
                >
                    <Select placeholder='请选择应用类别' >
                        {store?.typeOptions.map((item) => (
                            <Select.Option value={item.value} key={item.label}>
                                {item.label}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    label='配置key'
                    name='configkey'
                    rules={[{ required: true, message: '请输入配置key' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label='配置value'
                    name='configvalue'
                    rules={[{ required: true, message: '请输入配置value' }]}
                >
                    <Input />
                </Form.Item>



                <Form.Item
                    label='业务介绍'
                    name='describe'
                >
                    <Input />

                </Form.Item>

                <Form.Item
                    label='扩展字段'
                    name='ex'
                >
                    <Input />

                </Form.Item>

            </Form>
            <ModalFooter handleOk={onOk} handleCancel={onCancel} />
        </Modal>
    );
};

export default observer(AddModal);
