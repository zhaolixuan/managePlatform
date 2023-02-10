/* eslint-disable no-unused-vars */
import { useState } from 'react'
import { Modal, Form, Input, Select, message } from '@jd/find-react';
import { observer } from 'mobx-react';
import MapDraw from '@/components/MapDraw'
import { typeList } from '../constant';
import { useStore } from '@/hooks';
import ModalFooter from '@/views/Manage/componets/ModalFooter';
import styles from './AddModal.module.less'

const AddModal = ({ visible, setVisible }) => {
  const [form] = Form.useForm();
  const store = useStore('replenishmentManagement');
  const packetControlStore = useStore('packetControl');

  const [mapData, setMapData] = useState({
    latitude: '',
    longitude: '',
    id: '',
    polygon: ''
  });
  const [lnglat, setLnglat] = useState({});
  const [theme, setTheme] = useState('white');

  const onCancel = () => {
    setVisible(false);
    store.update({ gisData: [] });
    form.resetFields();
  }
  const onOk = () => {
    form.validateFields().then(async values => {
      if (!lnglat.latitude) return message.error('请选择坐标点');
      await store.addRegions({ ...values, ...lnglat })
      setVisible(false);
      store.regionsPageList();
      form.resetFields();
      store.update({ gisData: [] });
    })
  }

  const changeBusinessType = async (value) => {
    await store.getSiteLonLat({
      businessTypes: [value]
    })
  }

  const changeArea = async (_, { id }) => {
    form.setFieldsValue({ street: null });
    store.queryDictionaryList({
      parentCode: 'DICT_QYJD',
      parentId: id
    });
  }
  return (
    <Modal
      title='新增'
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      width='70%'
      footer={null}
    >
      <Form
        name='basic'
        className={styles['form-demo-basic']}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        form={form}
      >
        <Form.Item
          label='地区名称'
          name='businessName'
          rules={[{ required: true, message: '请输入地区名称' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label='所属行政区'
          name='area'
          rules={[{ required: true, message: '请选择所在行政区' }]}
        >
          <Select placeholder='请选择所在行政区' onChange={changeArea}>
            {store?.areaList?.map((item) => (
              <Select.Option value={item.childrenName} key={item.childrenCode} id={item.id}>
                {item.childrenName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label='	场所类型'
          rules={[{ required: true, message: '请选择场所类型' }]}
          name='businessType'
        >
          <Select placeholder='请选择场所类型' onChange={changeBusinessType}>
            {store?.sealingTypeList?.map((item) => (
              <Select.Option value={item.childrenCode} key={item.childrenCode}>
                {item.childrenName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label='所属街道'
          name='street'
          rules={[{ required: true, message: '请选择所属街道' }]}
        >
          <Select placeholder='请选择所属街道'>
            {store?.streetList?.map((item) => (
              <Select.Option value={item.childrenName} key={item.childrenName}>
                {item.childrenName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label='地址'
          name='address'
          rules={[{ required: true, message: '请输入地址' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label='联系人'
          name='contacts'
          rules={[{ required: true, message: '请输入联系人' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label='联系方式'
          name='contactNumber'
          rules={[
            { required: true, message: '请输入联系方式' },
            { pattern: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/, message: '请输入正确的手机号码' },
          ]}
        >
          <Input />
        </Form.Item>

      </Form>
      <MapDraw
        visible={visible}
        setMapData={setMapData}
        poiSearch={packetControlStore.poiSearch}
        mapData={mapData}
        theme={theme}
        drawAreaTabStatus={false}
        drawPointTabStatus
        drawPointStatus
        drawPolygonStatus={false}
        markerLayerStatus
        typeList={typeList}
        markerData={store?.gisData || []}
        showModal={false}
        setLnglat={setLnglat}
        scale={1}
        showSaveButton={false}
        showHeader={false}
        allowFirstSearch={false}
      />
      <ModalFooter handleOk={onOk} handleCancel={onCancel} />
    </Modal>
  );
};

export default observer(AddModal);
