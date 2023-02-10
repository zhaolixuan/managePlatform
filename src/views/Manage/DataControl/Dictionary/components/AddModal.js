/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'
import { Modal, Form, Input, Select, Row, Col, message, AutoComplete, Button, notification, Tooltip } from '@jd/find-react';
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
    const [tableData, setTableData] = useState([]);
    const [update, setUpdate] = useState(false);
    const [typeOptions, setTypeOptions] = useState([]);
    const [nameOptions, setNameOptions] = useState([]);
    const [tipModal, setTipModal] = useState(false);

    const [value, setValue] = useState();
    useEffect(() => {
        function getUrlParams2 (url) {
            let urlStr = url.split('?')[1]
            const urlSearchParams = new URLSearchParams(urlStr)
            const result = Object.fromEntries(urlSearchParams.entries())
            return result
        }
        var query = getUrlParams2(window.location.href)
        form.setFieldsValue({ parentName: query.parentName })
        form.setFieldsValue({ parentCode: query.parentCode })
        form.setFieldsValue({ type: query.type })
    }, [visible]);


    useEffect(() => {
        if (rowInfo) {
            setUpdate(rowInfo?.update) 
             setTableData([rowInfo])
        }
    }, [rowInfo]);

    useEffect(() => {
        if (visible) {
            getParentNameAndCodeList({ code: '', name: '' }).then(res => {
                let data1, data2
                data1 = res.map(item => {
                    return {
                        value: item.parentCode,
                        label: item.parentCode,
                        parentName: item.parentName
                    }
                })
                data2 = res.map(item => {
                    return {
                        value: item.parentName,
                        label: item.parentName,
                        parentCode: item.parentCode
                    }
                })
                setTypeOptions(data1)
                setNameOptions(data2)
            })
        }
    }, [visible]);

    const onCancel = () => {
        setVisible(false);
        form.resetFields();
    }

    const checkRepeatChildrenCode = (data) => {
        // false 代表有重复的
        const obj = {}
        let flag = data.every(item => {
            return obj[item.childrenCode] ? false : obj[item.childrenCode] = true
        })
        console.log(flag, '1111')
        return flag
    }

    const onOk = () => {
        form.validateFields().then(async values => {
            console.log(values, tableData, 'values')
            if (!tableData.length) {
                message.error('请至少添加一项')
                return false
            }
            let flag = checkRepeatChildrenCode(tableData)
            if (!flag) {
                message.error('请检查字典项编码保持同组内唯一')
                return false
            }
            let data = tableData
            data = data.map(item => {
                delete item.edit
                return {
                    ...item,
                    sort: +item.sort,
                    ...values
                }
            })
            console.log(data)
            if (rowInfo?.update) { //修改
                await store.updateRegions(data[0])
            } else { // 新增
                await store.addRegions(data)
            }
            setVisible(false);
            store.regionsPageList();
            form.resetFields();
        })
    }
    const handleSave = data => {
        console.log(data)
        setTableData(data)
    }

    const autoChange = (e) => {
        console.log(e)
        setTypeOptions([])
        getParentNameAndCodeList({ code: e, name: '' }).then(res => {
            res = res.map(item => {
                return {
                    value: item.parentCode,
                    label: item.parentCode,
                    parentName: item.parentName
                }
            })
            setTypeOptions(res)
        })
        let data = typeOptions.filter(item => item.value === e)
        data.length && form.setFieldsValue({ parentName: data[0].parentName })
    }

    const nameChange = (e) => {
        console.log(e)
        setNameOptions([])
        getParentNameAndCodeList({ name: e, code: '' }).then(res => {
            console.log(res)
            res = res.map(item => {
                return {
                    value: item.parentName,
                    label: item.parentName,
                    parentCode: item.parentCode
                }
            })
            setNameOptions(res)
        })
        let data = nameOptions.filter(item => item.label === e)
        data.length && form.setFieldsValue({ parentCode: data[0].parentCode })
        console.log(data)
    }

    const openMessage = () => {
        // message.config({
        //   top: 100,
        // });
        message.info(
            <div className={styles.tip}>
                <Button className={styles.closeButtonTip} shape="circle" icon={<CloseOutlined />} onClick={() => { message.destroy() }} />
                <p>注意规范：</p>
                <p>字典名称和字典编码  指的是归于那个事件类别，例如：行政区域  DOCT_XZQY</p>
                <p>字典编码保持全大写DICT_开头，同一个字典编码只会属于一个字典名称！</p>
                <p>字典名称和字典项编码  指的事件中的类别选项，例如：海淀区   DICT_HAIDIANQU</p>
                <p>字典项编码尽量保持全大写DICT_开头，要保持在同一个分组里面的唯一性！</p>
            </div>, [3]
        )
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
                {/* <Tooltip placement="right" title="注意规范：
					字典名称和字典编码  指的是归于那个事件类别，例如：行政区域  DOCT_XZQY
					字典编码保持全大写DICT_开头，同一个字典编码只会属于一个字典名称！
					字典名称和字典项编码  指的事件中的类别选项，例如：海淀区   DICT_HAIDIANQU
					字典项编码尽量保持全大写DICT_开头，要保持在同一个分组里面的唯一性！">
          <InfoCircleOutlined className={styles.tip} />
        </Tooltip> */}
                {/* <Button onClick={() => {setTipModal(true)}}>操作规范</Button> */}
                {/* <Button type="primary" onClick={() => openNotification('topRight')}> */}
                <Button className={styles.tipBtn} type="primary" onClick={openMessage}>
                    操作规范
                </Button>
                <Modal
                    title="Basic Modal"
                    visible={tipModal}
                    footer={null}
                >
                    <p>注意规范：
                        字典名称和字典编码  指的是归于那个事件类别，例如：行政区域  DOCT_XZQY
                        字典编码保持全大写DICT_开头，同一个字典编码只会属于一个字典名称！
                        字典名称和字典项编码  指的事件中的类别选项，例如：海淀区   DICT_HAIDIANQU
                        字典项编码尽量保持全大写DICT_开头，要保持在同一个分组里面的唯一性！</p>
                    {/* <p>Some contents...</p>
          <p>Some contents...</p> */}
                </Modal>
                <Row>
                    <Col span={12}>
                        <Form.Item
                            label='字典名称'
                            name='parentName'
                            rules={[{ required: true, message: '请输入字典名称' }]}
                        >
                            <AutoComplete
                                disabled
                                onChange={nameChange}
                                style={{ width: 200 }}
                                placeholder="保持规范"
                                options={nameOptions}
                            />
                            {/* <SearchInput
                placeholder=""
                value={form.parentName}
                changeParentName={changeParentName}
                style={{
                  width: 200,
                }}
              /> */}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label='字典编码'
                            name='parentCode'
                            rules={[
                                { required: true, pattern: /^DICT_/, message: '字典编码保持全大写DICT_开头，同一个字典编码只会属于一个字典名称！' }
                            ]}
                        >
                            <AutoComplete
                                disabled

                                onChange={autoChange}
                                style={{ width: 200 }}
                                placeholder="保持规范"
                                options={typeOptions}
                            />
                            {/* <SearchInput2
                placeholder=""
                value={form.parentCode}
                changeParentCode={changeParentCode}
                style={{
                  width: 200,
                }}
              /> */}
                        </Form.Item>
                    </Col>

                </Row>
                <AddTable update={update} rowInfo={rowInfo} data={tableData} handleSave={handleSave} />
            </Form>
            <ModalFooter handleOk={onOk} handleCancel={onCancel} />
        </Modal>
    );
};

export default observer(AddModal);
