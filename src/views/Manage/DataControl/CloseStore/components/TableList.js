/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { Form, Table, Input, Button, Select, message, InputNumber, Tooltip, Modal } from '@jd/find-react';
import { observer } from 'mobx-react';
// import { toJS } from 'mobx';
import MapDraw from '@/components/MapDraw';
import { useStore, useRouter } from '@/hooks';
import styles from '../index.module.less';
// import { typeList } from '../constant';
// import { addRegions } from '@/api/ReplenishmentManagement';
import EditModal from './EditModal';
import moment from 'moment';

const TableList = ({ searchFrom }) => {
  //   const [ids, setIds] = useState([]);
  const [spinStatus, setSpinStatus] = useState(false);
  const [mapOpenStatus, setMapOpenStatus] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  // const [editingKey, setEditingKey] = useState('');
  // const [form] = Form.useForm();

  const store = useStore('closeStore');
  // const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const packetControlStore = useStore('packetControl');
  // const { history } = useRouter();

  const [mapData, setMapData] = useState({
    latitude: '',
    longitude: '',
    id: '',
    polygon: '',
  });
  const [theme, setTheme] = useState('white');
  const [editData, setEditData] = useState({});

  const columns = [
    {
      title: '门店名称',
      dataIndex: 'shopName',
      key: 'shopName',
      width: 200,
      // editable: true,
      inputType: 'select',
      selectData: 'administrativeList',
      // onChange: changeArea,
      fixed: 'left',
      render: (text) => <>{text || '-'}</>,
    },
    {
      title: '所属行政区',
      dataIndex: 'area',
      key: 'area',
      width: 120,
      // editable: true,
      inputType: 'select',
      selectData: 'administrativeList',
      // onChange: changeArea,
      render: (text) => <>{text || '-'}</>,
    },
    {
      title: '所属街道',
      dataIndex: 'street',
      key: 'street',
      width: 180,
      // editable: true,
      inputType: 'select',
      // selectData: 'streetList',
      render: (text) => <>{text || '-'}</>,
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
      width: 200,
      // editable: true,
      inputType: 'input',
      render: (text) => <>{text || '-'}</>,
    },
    {
      title: '闭店时间',
      dataIndex: 'closeDate',
      key: 'closeDate',
      width: 150,
      // editable: true,
      inputType: 'input',
      render: (text) => <>{text ? moment(text).format('YYYY-MM-DD') : '-'}</>,
    },
    {
      title: '闭店原因',
      dataIndex: 'closeCause',
      key: 'closeCause',
      width: 250,
      // editable: true,
      inputType: 'input',
      render: (text) => <>{text || '-'}</>,
    },
    {
      title: '通知闭店机构',
      dataIndex: 'noticeOrg',
      key: 'noticeOrg',
      width: 200,
      // editable: true,
      inputType: 'input',
      render: (text) => <>{text || '-'}</>,
    },
    {
      title: '恢复营业时间',
      dataIndex: 'recoveryTime',
      key: 'recoveryTime',
      width: 150,
      // editable: true,
      inputType: 'input',
      render: (text) => (
        <>
          {text && text === '待通知' ? text : text && text !== '待通知' ? moment(text).format('YYYY-MM-DD') : '待通知'}
        </>
      ),
    },
    {
      title: '恢复营业前措施',
      dataIndex: 'useMethod',
      key: 'useMethod',
      width: 350,
      // editable: true,
      inputType: 'input',
      render: (text) => <>{text || '-'}</>,
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      width: 300,
      fixed: 'right',
      render: (_, record) => (
        <>
          <Button type='link' onClick={() => editItem(record)}>
            编辑属性
          </Button>
          <Button type='link' onClick={() => editzuobiao(record)}>
            编辑坐标
          </Button>
          <Button type='link' onClick={() => deleteItem(record)}>
            删除
          </Button>
        </>
      ),
    },
  ];
  //   编辑属性
  const editItem = (value) => {
    let areaId = '';
    store.areaList.some((item) => {
      if (item.childrenName === value.area) {
        return (areaId = item.id);
      }
    });
    const newValue = { ...value, areaId };
    newValue.closeDate = value.closeDate ? moment(value.closeDate) : '';
    newValue.recoveryTime = value.recoveryTime ? moment(value.recoveryTime) : '';
    setEditData(newValue);
    setEditVisible(true);
  };
  //   编辑坐标
  const editzuobiao = async (value) => {
    console.log(value);
    // await store.getSiteLonLat({
    //     businessTypes: [value.businessType]
    // });
    setMapOpenStatus(true);
    setMapData({
      ...mapData,
      liveName: value.shopName,
      ...value,
      latitude: value.shopLatitude || '39.9021259546912',
      longitude: value.shopLongitude || '116.40112062953222',
    });
  };
  // 删除
  const deleteItem = ({ id }) => {
    Modal.confirm({
      title: '确定删除吗?',
      className: styles.confirm_wrap,
      async onOk() {
        try {
          await store.deleteItem(id);
          searchFrom.setFieldsValue({ keyWord: '' });
          message.success('删除成功');
          const { total, pageSize, current } = store.pagination;
          if (total % pageSize === 1 && current !== 1) {
            await store.regionsPageList({
              ...store.pagination,
              current: current - 1,
              page: current - 1,
            });
            return;
          }
          await store.regionsPageList();
        } catch (error) {}
      },
    });
  };
  //  分页
  const changePage = (pageObj) => {
    console.log(pageObj);
    store.update({
      pagination: pageObj,
    });
    store.regionsPageList();
  };

  // 保存地图数据
  const saveDrawData = async (data) => {
    setSpinStatus(true);
    await store.editRegions({
      ...data.mapData,
      shopLatitude: data.latitude,
      shopLongitude: data.longitude,
    });
    message.success('编辑坐标成功');
    setSpinStatus(false);
    setMapOpenStatus(false);
    store.regionsPageList();
    store.update({
      gisData: [],
    });
  };

  return (
    <>
      {/* <Form form={form} component={false}> */}
      <Table
        loading={store.loading}
        dataSource={store?.tableData || []}
        columns={columns}
        rowClassName='editable-row'
        pagination={{
          ...store.pagination,
          showSizeChanger: true,
          showQuickJumper: true,
          showLessItems: true,
          showTotal: (total) => `共 ${total} 条`,
        }}
        onChange={changePage}
        scroll={{ x: 'max-centent', y: '620px' }}
        rowKey='id'
      />
      {/* </Form> */}
      {mapOpenStatus && (
        <MapDraw
          visible={mapOpenStatus}
          saveDrawData={saveDrawData}
          // setMapData={setMapData}
          // setVisible={setMapOpenStatus}
          poiSearch={packetControlStore.poiSearch}
          mapData={mapData}
          theme={theme}
          drawAreaTabStatus={false}
          drawPointTabStatus
          drawPointStatus
          drawPolygonStatus={false}
          markerLayerStatus
          typeList={[]}
          markerData={store?.gisData || []}
          showModal
          scale={1}
          handleCancel={() => {
            setMapOpenStatus(false);
            store.update({
              gisData: [],
            });
          }}
          spinStatus={spinStatus}
        />
      )}
      <EditModal visible={editVisible} setVisible={setEditVisible} editData={editData}></EditModal>
    </>
  );
};
export default observer(TableList);
