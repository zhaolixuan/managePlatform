/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'
import { Modal, Form, Input, Select, Row, Col, message, AutoComplete, Button, notification, Tooltip, Switch } from '@jd/find-react';
import {
    RadiusUpleftOutlined,
    RadiusUprightOutlined,
    RadiusBottomleftOutlined,
    RadiusBottomrightOutlined,
    CloseOutlined
} from '@ant-design/icons';
import { observer } from 'mobx-react';
import { useStore } from '@/hooks';
import ModalFooter from '@/views/Manage/componets/ModalFooter';
import styles from './AddModal.module.less'
const { Option } = Select;
let timeout;
let currentValue;
import AddTable from './AddTable';

import { getParentNameAndCodeList } from '@/api/dictionary'
import { divide } from 'lodash';



const AddModal = ({ visible, setVisible, rowInfo }) => {
    const [form] = Form.useForm();
    const store = useStore('dictionary');
    const [update, setUpdate] = useState(false);
    const [status, setStatus] = useState(0);
    const [typeOptions, setTypeOptions] = useState([
        { label: '业务', value: 1 },
        { label: '系统', value: 2 },
    ]);

    useEffect(() => {
        if (rowInfo) {
            form.setFieldsValue({ parentName: rowInfo.parentName, parentCode: rowInfo.parentCode, type: rowInfo.type, details: rowInfo.details, isKy: rowInfo.status ? false : true })
            setStatus(rowInfo.status)
            setUpdate(rowInfo?.update)
            console.log(rowInfo);
        }
    }, [rowInfo]);

    useEffect(() => {
        if (!rowInfo) {
            form.setFieldsValue({ type: 1, isKy: true })
            setStatus(0);
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

                    await store.IndexupdateRegions({ ...rowInfo, status, ...values })
                } else { // 新增
                    await store.IndexaddRegions({ ...values, status })
                }
                setVisible(false);
                store.queryDictionaryGroupByParentCodeList();
                form.resetFields();
            } catch (error) {
                console.log(error);
            }


        })
    }
    const changeIsKy = async (value) => {
        setStatus(value ? 0 : 1);
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
                    label='字典名称'
                    name='parentName'
                    rules={[{ required: true, message: '请输入字典名称' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label='字典编码'
                    name='parentCode'

                    rules={[
                        { required: true, pattern: /^DICT_/, message: '字典编码保持全大写DICT_开头，同一个字典编码只会属于一个字典名称！' }
                    ]}
                >
                    <Input disabled={rowInfo?.update} />

                </Form.Item>
                <Form.Item
                    label='介绍'
                    name='details'
                >
                    <Input />

                </Form.Item>
                <Form.Item
                    label='类型'
                    name='type'
                    rules={[{ required: true, message: '请选择类型' }]}
                >
                    <Select placeholder='请选择类型' >
                        {typeOptions.map((item) => (
                            <Select.Option value={item.value} key={item.label}>
                                {item.label}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    label='是否可用'
                    name='isKy'
                    valuePropName="checked"
                >

                    <Switch onChange={changeIsKy} />
                </Form.Item>
            </Form>
            <ModalFooter handleOk={onOk} handleCancel={onCancel} />
        </Modal>
    );
};

export default observer(AddModal);
