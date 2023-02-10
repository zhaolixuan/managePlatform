import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Col, Row, DatePicker, Button, Table, Tooltip } from '@jd/find-react';
import moment from 'moment';
import Detail from './Detail.js';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import { useStore } from '@/hooks';
import { downloadExcel } from '@/utils/util.js'
import { verificationPath } from '@/utils/Permission';
import styles from './index.module.less';

const CarPeopleReport = () => {
  const [filterForm] = Form.useForm();
  const { RangePicker } = DatePicker;
  const { getTable, tableData, checkDetail,
    detailData, pagination, update, loading,
    requestParama, downloadFile }
    = useStore('carPeopleReport');
  const [detailVisible, setDetailVisible] = useState(false);
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [permissionData, setPermissionData] = useState({});

  useEffect(() => {
    // 获取天权配置
    const getPermission = () => {
      let data = verificationPath();
      let arr = {};
      data?.forEach((i) => {
        arr[i.code] = true;
      });
      setPermissionData(arr);
    };
    getPermission();
    getTable();
  }, [])

  console.log(toJS(tableData), '??')
  console.log(toJS(pagination), 'pagination')

  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      width: '60px',
      render: (text, record, index) => <>{(pagination.current - 1) * pagination.pageSize + index + 1 || '-'}</>,
    },
    {
      title: '来源地',
      dataIndex: 'provinceName',
      key: 'provinceName',
      width: 90,
      render: (text, record) => <>{`${record?.provinceName} - ${record?.cityName} - ${record?.areaName}` || '-'}</>,
    },
    {
      title: '企业名称',
      dataIndex: 'companyName',
      key: 'companyName',
      render: (text) => (
        <Tooltip title={text}>
          <div>{text}</div>
        </Tooltip>
      ),
    },
    {
      title: '司机名称',
      dataIndex: 'driverName',
      key: 'driverName',
      width: 100,
      render: (text) => <>{text || '-'}</>,
    },
    {
      title: '司机手机号',
      dataIndex: 'driverTel',
      key: 'driverTel',
      render: (text) => <>{text || '-'}</>,
    },
    {
      title: '司机身份证号',
      dataIndex: 'driverIdNumber',
      key: 'driverIdNumber',
      width: 200,
      render: (text) => (
        <Tooltip title={text}>
          <div className={styles['live-name']}>{text}</div>
        </Tooltip>
      ),
    },
    {
      title: '车牌号',
      dataIndex: 'plateNumber',
      key: 'plateNumber',
      render: (text) => <>{text || '-'}</>,
    },
    {
      title: '车牌颜色',
      dataIndex: 'plateColor',
      key: 'plateColor',
      width: 100,
      render: (text) => <>{text || '-'}</>,
    },
    {
      title: '预计出发时间',
      dataIndex: 'expectDepartureTime',
      key: 'expectDepartureTime',
      ellipsis: {
        showTitle: false,
      },
      render: (text) => (
        <Tooltip title={text}>
          <div>{text}</div>
        </Tooltip>
      ),
    },
    {
      title: '提交时间',
      dataIndex: 'createTime',
      key: 'createTime',
      ellipsis: {
        showTitle: false,
      },
      render: (text) => (
        <Tooltip title={text}>
          <div>{text}</div>
        </Tooltip>
      ),
    },
    {
      title: '状态说明',
      dataIndex: 'togetherInfoVos',
      key: 'togetherInfoVos',
      render: (text) => (
        <div>{text ? text?.join(',') : '-'}</div>
      ),
    },
    {
      title: '是否进入新发地',
      dataIndex: 'arrivedStatus',
      key: 'arrivedStatus',
      render: (text) => <>{text || '-'}</>,
    },
    {
      title: '健康码状态',
      dataIndex: 'jkbStatus',
      key: 'jkbStatus',
      width: 120,
      render: (text) => <>{text || '-'}</>,
    },
    {
      title: '生成白名单时间',
      dataIndex: 'whiteCreateTime',
      key: 'whiteCreateTime',
      render: (text) => (
        <Tooltip title={text}>
          <div>{text || '-'}</div>
        </Tooltip>
      ),
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      width: '80px',
      align:'center',
      fixed: 'right',
      render: (_, record) => {
        return (
          <div className={styles['detail-button-wrapper']}>
            <Button
              type='link'
              onClick={() => {
                const detalRes = checkDetail(record.id);
                setDetailVisible(true);
              }
              }>
              详情
            </Button>
          </div>
        );
      },
    },
  ];

  const data = [];

  // 重置
  const reset = () => {
    filterForm.resetFields();
    getTable({});
  };

  // 搜索
  const onFinish = (e) => {
    console.log(e, 'onFinish----');
    getTable({
      ...requestParama,
      ...e,
      startTime: startTime,
      endTime: endTime
    });
  };

  // 修改页面
  const changePage = (pageObj) => {
    update({
      pagination: pageObj
    });
    getTable({
      ...requestParama,
      ...pageObj,
      page: pageObj.current
    });
  }

  // 提交时间
  const onTimeChange = (e) => {
    setStartTime(moment(e[0]).format('YYYY-MM-DD HH:mm:ss'));
    setEndTime(moment(e[1]).format('YYYY-MM-DD HH:mm:ss'))
  }

  // 导出列表
  const download = async () => {
    const param = {
      page: pagination.current,
      pageSize: pagination.pageSize,
      ...requestParama
    }
    const res = await downloadFile(param);
    downloadExcel(res, '车辆司乘人员报备列表')
  }

  return (
    <div>
      <div className={styles['filter-wrapper']}>
        <Form name='filters' form={filterForm} layout='inline' className={styles['form-style']} onFinish={onFinish}>
          <Row>
            <Col span={6}>
              <Form.Item name='plateNumber' label='车牌号'>
                <Input placeholder='请输入车牌号' />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name='driverName' label='司机姓名'>
                <Input placeholder='请输入司机姓名' />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name='driverTel' label='司机手机号'>
                <Input placeholder='请输入司机手机号' />
              </Form.Item>
            </Col>
            <Col span={6}>

              <Form.Item name='arrivedStatus' label='是否进入新发地'>
                {/* need todo请求后端接口 */}
                <Select allowClear placeholder='是否进入新发地'>
                  {/* 
                <Option value='wait'>待审核</Option>
                <Option value='success'>审核通过</Option>
                <Option value='reject'>审核拒绝</Option> */}
                  {/* <Option value=''>全部</Option> */}
                  <Option value='wait'>未校验</Option>
                  <Option value='arrived'>是</Option>
                  <Option value='unarrived'>否</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>

              <Form.Item name='driverIdNumber' label='司机身份证证号'>
                <Input placeholder='请输入司机身份证号' />
              </Form.Item>
            </Col>
            <Form.Item name='applyTime' label='申请时间'>
              <RangePicker
                ranges={{
                  Today: [moment(), moment()],
                  'This Month': [moment().startOf('month'), moment().endOf('month')],
                }}
                showTime={{
                  hideDisabledOptions: true,
                  defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
                }}
                format="YYYY-MM-DD HH:mm:ss"
                onChange={onTimeChange}
              />
            </Form.Item>

            <Col flex={1} className={styles['button-wrapper']}>
              <Form.Item>
                <Button type='primary' htmlType='submit'>
                  查询
                </Button>
              </Form.Item>
              <Button type='default' onClick={reset}>
                重置
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
      <div className={styles['export-button-wrapper']}>
        {console.log(permissionData, 'permissionData')}
        <Button style={{ display: permissionData.exportCarPeopleReport ? 'inline-block' : 'none' }} type='primary' onClick={download}>导出列表</Button>
      </div>
      <Table
        columns={columns}
        dataSource={tableData.list}
        className={styles['table-wrapper']}
        onChange={changePage}
        pagination={pagination}
        loading={loading}
      // pagination={{ showSizeChanger: true, showQuickJumper: true, showTotal: (total) => `共 ${total} 条` }}
      // scroll={{ x: 'max-centent'}}
      />
      <Detail setDetailVisible={setDetailVisible} detailVisible={detailVisible} data={detailData} />
    </div>
  );
};

export default observer(CarPeopleReport);
