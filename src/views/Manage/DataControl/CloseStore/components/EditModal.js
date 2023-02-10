/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, message, DatePicker } from '@jd/find-react';
import { observer } from 'mobx-react';
import ModalFooter from '@/views/Manage/componets/ModalFooter';
import { useStore } from '@/hooks';
import styles from './EditModal.module';
import moment from 'moment';

const EditModal = ({ visible, setVisible, editData }) => {
  const [form] = Form.useForm();
  const store = useStore('closeStore');
  //   控制街道的校验规则
  const [streetRequired, setStreetRequired] = useState(true);
  const onCancel = () => {
    setVisible(false);
    form.resetFields();
    store.update({
      gisData: [],
      streetList: [],
    });
  };
  const onOk = () => {
    form.validateFields().then(async (values) => {
      const newValue = { ...values };
      newValue.closeDate = values.closeDate ? moment(values.closeDate).format('YYYY-MM-DD') : '';
      newValue.recoveryTime = values.recoveryTime ? moment(values.recoveryTime).format('YYYY-MM-DD') : '';
      await store.editRegions({ ...newValue, id: editData.id });
      message.success('编辑属性成功')
      onCancel();
      store.regionsPageList();
    });
  };

  const changeArea = async (_, { id }) => {
    // 如果是经开区的话，没有街道，就不校验街道信息
    if (id === 19) {
      setStreetRequired(false);
    } else {
      setStreetRequired(true);
    }
    form.setFieldsValue({ street: '' });
    store.queryDictionaryList({
      parentCode: 'DICT_QYJD',
      parentId: id,
    });
  };
  useEffect(() => {
    visible && form.setFieldsValue(editData);
    visible && store.queryDictionaryList({ parentCode: 'DICT_QYJD', parentId: editData.areaId });
  }, [visible]);

  return (
    <Modal title='编辑' visible={visible} onOk={onOk} onCancel={onCancel} width='70%' footer={null}>
      <Form
        name='basic'
        className={styles['form-demo-basic']}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        form={form}
      >
        <Form.Item label='门店名称' name='shopName' rules={[{ required: true, message: '请输入门店名称' }]}>
          <Input placeholder='请输入门店名称' />
        </Form.Item>

        <Form.Item label='所属行政区' name='area' rules={[{ required: true, message: '请选择所在行政区' }]}>
          <Select placeholder='请选择所在行政区' onChange={changeArea}>
            {store?.areaList?.map((item) => (
              <Select.Option value={item.childrenName} key={item.childrenCode} id={item.id}>
                {item.childrenName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label='所属街道' name='street' rules={[{ required: streetRequired, message: '请选择所属街道' }]}>
          <Select placeholder='请选择所属街道'>
            {store?.streetList?.map((item) => (
              <Select.Option value={item.childrenName} key={item.childrenName}>
                {item.childrenName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label='地址' name='address' rules={[{ required: true, message: '请输入地址' }]}>
          <Input placeholder='请输入地址' />
        </Form.Item>
        <Form.Item label='闭店时间' name='closeDate' rules={[{ required: true, message: '请选择闭店时间' }]}>
          <DatePicker placeholder='请选择闭店时间' />
        </Form.Item>

        <Form.Item label='闭店原因' name='closeCause' rules={[{ required: true, message: '请输入闭店原因' }]}>
          <Input placeholder='请输入闭店原因' />
        </Form.Item>

        <Form.Item label='通知闭店机构' name='noticeOrg' rules={[{ required: true, message: '请输入通知闭店机构' }]}>
          <Input placeholder='请输入通知闭店机构' />
        </Form.Item>
        <Form.Item label='恢复营业时间' name='recoveryTime'>
          <DatePicker placeholder='请选择营业恢复营业时间' />
        </Form.Item>
        <Form.Item
          label='恢复营业前措施'
          name='useMethod'
          rules={[{ required: true, message: '请输入恢复营业前措施' }]}
        >
          <Input placeholder='请输入恢复营业措施' />
        </Form.Item>
      </Form>
      <ModalFooter handleOk={onOk} handleCancel={onCancel} />
    </Modal>
  );
};

export default observer(EditModal);
