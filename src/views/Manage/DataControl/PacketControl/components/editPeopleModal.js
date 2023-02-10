/* eslint-disable */
import { useEffect, useState } from 'react';
import { useStore } from '@/hooks'
import { Form, Modal, message, InputNumber } from '@jd/find-react';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const editPeopleModal = ({ visible, setVisible, editData, setEditData, getList }) => {
  const store = useStore('packetControl');
  const [form] = Form.useForm();

  const handleOk = () => {
    form.validateFields().then(async values => {
      try {
      await store.savePeople({ ...values, id: editData.id });
      form.resetFields();
      setEditData(null);
      getList();
      } catch (error) {
        console.log(error);
      }
    })
    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  useEffect(() => {
    editData && form.setFields([
      {
        value: editData.giveNum,
        name: 'giveNum'
      },
      {
        value: editData.householdNum,
        name: 'householdNum'
      },
      {
        value: editData.peopleNum,
        name: 'peopleNum'
      },
      {
        value: editData.spotNum,
        name: 'spotNum'
      },
    ])
  }, [editData])

  return (
    <Modal
      title='编辑人口数属性组'
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form
        name="basic"
        className="form-demo-basic"
        form={form}
      >
        <Form.Item
          label="配送人员数"
          name="giveNum"
          rules={[{ required: true, message: '请输入配送人员数' }]}
        >
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="管控楼栋数"
          name="householdNum"
          rules={[{ required: true, message: '请输入管控楼栋数' }]}
        >
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="管控区人数"
          name="peopleNum"
          rules={[{ required: true, message: '请输入管控区人数' }]}
        >
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="管控区点数"
          name="spotNum"
          rules={[{ required: true, message: '请输入管控区点数' }]}
        >
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>

      </Form>
    </Modal>
  );
};

export default editPeopleModal;