import { Modal, Form, Input, DatePicker, Row, Col } from '@jd/find-react';
import ModalFooter from '@/views/Manage/componets/ModalFooter';
import moment from 'moment';
import { useStore } from '@/hooks';

const AddModal = ({ visible, name, businessId, handleAddItem, setVisible }) => {
  const [form] = Form.useForm();
  const time = moment().format('YYYY-MM-DD')
  // form.setFieldsValue({businessName: name, businessId})
  const store = useStore('shortageOfFill');
  const onCancel = () => {
    setVisible(false);
  }
  const handleAdd = () => {
    handleAddItem();
  }
  const onOk = () => {
    form.validateFields().then(async values => {
      await store.addSupplyChain({...values, businessName:name, businessId, enteringTime: values.enteringTime.format('YYYY-MM-DD HH:ss:mm')})
      // await store.addSupplyChain({...values, enteringTime: moment().format('YYYY-MM-DD HH:ss:mm')})
      // console.log(values,name);
      form.resetFields();
      setVisible(false);
      handleAdd()
    })
  }
  return (
    <Modal
      title='新增'
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      footer={null}
      width='60%'
    >
      <Form
        name='basic'
        className='form-demo-basic'
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        form={form}
        initialValues={{enteringTime: moment(time)}}
      >
        {/* <Form.Item
          label='地区名称'
          name='name'
          rules={[{ required: true, message: '请输入地区名称' }]}
        >
          <Input />
        </Form.Item> */}
        <Form.Item
          label='录入时间'
          name='enteringTime'
          rules={[{ required: true, message: '请选择录入时间' }]}
        >
          <DatePicker name='enteringTime' format='YYYY-MM-DD'/>
        </Form.Item>
        <Form.Item
          label='主食缺货量（公斤）'
          name='stapleReplenishment'
          rules={[{ required: true, whitespace: true, type:'number', transform(value) { if(value){ return Number(value) } }, message: '请输入有效主食缺货量' }]}
        >
          <Row>
            <Col span={20}>
              <Input size='large'/>
            </Col>
          </Row>
        </Form.Item>

        <Form.Item
          label='副食缺货量（公斤）'
          name='subsidiaryReplenishment'
          rules={[{ required: true, whitespace: true, type:'number', transform(value) { if(value){ return Number(value) } }, message: '请输入有效副食缺货量' }]}
        >
          <Row>
            <Col span={20}>
              <Input size='large'/>
            </Col>
          </Row>
        </Form.Item>

        <Form.Item
          label='蔬菜缺货量（公斤）'
          name='vegetableReplenishment'
          rules={[{ required: true, whitespace: true, type:'number', transform(value) { if(value){ return Number(value) } }, message: '请输入有效蔬菜缺货量' }]}
        >
          <Row>
            <Col span={20}>
              <Input size='large'/>
            </Col>
          </Row>
        </Form.Item>

        <Form.Item
          label='水果缺货量（公斤）'
          name='fruitReplenishment'
          rules={[{ required: true, whitespace: true, type:'number', transform(value) { if(value){ return Number(value) } }, message: '请输入有效水果缺货量' }]}
        >
          <Row>
            <Col span={20}>
              <Input size='large'/>
            </Col>
          </Row>
        </Form.Item>

        {/* <Form.Item
          label='录入时间'
          name='contactNumber'
          rules={[{ required: true, message: '请输入录入时间' }]}
        >
          <Input />
        </Form.Item> */}
      </Form>
      <ModalFooter handleOk={onOk} handleCancel={onCancel} />
    </Modal>
  );
};

export default AddModal;
