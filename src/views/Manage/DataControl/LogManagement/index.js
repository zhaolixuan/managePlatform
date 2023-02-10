import React, { useState, useEffect } from 'react';
import { Radio, Form, Col, Row, DatePicker, Table, Tooltip } from '@jd/find-react';
import moment from 'moment';
import Chart from './chart';
import TableTab from './table';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import { useStore } from '@/hooks';
import JdProgress from '@/components/Progress';
// import { verificationPath } from '@/utils/Permission';
import styles from './index.module.less';

const LogManagement = () => {
  const [filterForm] = Form.useForm();
  const { RangePicker } = DatePicker;
  const { getTrafficAndRatesData, trafficAndRatesData,getTrafficData,trafficData,getTable,tableData,
    getOrgAccessData,orgAccessData,getFunctionAccessData,functionAccessData,pagination,update,loading,
    requestParama,}
  = useStore('logManagement');

  const getTime = (num, startOrEnd) => {
    let today = moment(new Date())[`${startOrEnd}Of`]("day"); 
    return moment(today).subtract(num, "day").format("YYYY-MM-DD HH:mm:ss");
  };

  let time  = [getTime(1,'start'), getTime(1,'end')]

  const [startDate,setStartTime] = useState(time[0]);
  const [endDate,setEndTime] = useState(time[1]);
  // const [permissionData, setPermissionData] = useState({});
  const [dateValue, setDateValue] = useState(1);

  
  useEffect(()=>{
    let params = {
      startDate: startDate,
      endDate: endDate
    }
    console.log(params,'params');
    getTable(params);
    getTrafficAndRatesData(params);
    getTrafficData(params);
    getOrgAccessData(params);
    getFunctionAccessData(params);
  },[startDate,endDate])

   console.log(toJS(tableData),'tableData');
  const columnsTop10 = [
    {
      title: '',
      dataIndex: 'operationName',
      key: 'operationName',
      width: '80%',
      render: (text, item) => (
        <div className={styles.bar}>
          <Tooltip title={text}><span>{text || '-'}</span></Tooltip>
          {item?.count && (
            <JdProgress
              percent={(item?.count / functionAccessData[0]?.count) * 100}
              steps={40}
              size='small'
              showInfo={false}
            />
          )}
        </div>
      ),
    },
    {
      title: '',
      dataIndex: 'count',
      key: 'count',
      render: (text) => <>{text}</>,
    }
  ];
  const columnsArea = [
    {
      title: '',
      dataIndex: 'org',
      key: 'org',
      width: '80%',
      render: (text, item) => (
        <div className={styles.bar}>
          <span>{text || '-'}</span>
          {item?.count && (
            <JdProgress
              percent={(item?.count / orgAccessData[0]?.count) * 100}
              steps={40}
              size='small'
              showInfo={false}
            />
          )}
        </div>
      ),
    },
    {
      title: '',
      dataIndex: 'count',
      key: 'count',
    },
  ];
  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      width: 60,
      fixed: 'left',
      render: (text,record,index) => <>{ index + 1 || '-'}</>,
    },
    {
      title: '账户所属',
      dataIndex: 'org',
      key: 'org',
      width: 120,
      fixed: 'left',
      render: (text) => <>{text || '-'}</>,
    },
    {
      title: '账户级别',
      dataIndex: 'orgLevel',
      key: 'orgLevel',
      width: 120,
      render: (text) => (
          <div>{text|| '-'}</div>
      ),
    },
    {
      title: '系统登录次数',
      dataIndex: 'num1',
      key: 'num1',
      width: 100,
      render: (text) => <>{text}</>,
    },
    {
      title: '保供场所按钮点击次数',
      dataIndex: 'num2',
      key: 'num2',
      width: 120,
      render: (text) => <>{text}</>,
    },
    {
      title: '封管控区按钮点击次数',
      dataIndex: 'num3',
      key: 'num3',
      width: 120,
      render: (text) => <>{text}</>,
    },
    {
      title: '保供人员按钮点击次数',
      dataIndex: 'num4',
      key: 'num4',
      width: 120,
      render: (text) => <>{text}</>,
    },
    {
      title: '保供车辆（京外）按钮点击次数',
      dataIndex: 'num5',
      key: 'num5',
      width: 120,
      render: (text) => <>{text }</>,
    },
    {
      title: '保供车辆（京内）按钮点击次数',
      dataIndex: 'num6',
      key: 'num6',
      width: 120,
      render: (text) => <>{text }</>,
    },
    {
      title: '联系我们按钮点击次数',
      dataIndex: 'num8',
      key: 'num8',
      width: 120,
      render: (text) => <>{text}</>,
    },
    {
      title: '管理后台按钮点击次数',
      dataIndex: 'num7',
      key: 'num7',
      width: 120,
      render: (text) => <>{text}</>,
    },
    // {
    //   title: '京内车辆系统登录次数',
    //   dataIndex: 'num9',
    //   key: 'num9',
    //   width: 120,
    //   render: (text) => <>{text }</>,
    // },
    // {
    //   title: '白名单登录次数',
    //   dataIndex: 'num10',
    //   key: 'num10',
    //   width: 120,
    //   render: (text) => <>{text}</>,
    // },
    // {
    //   title: '核酸登记薄登录次数',
    //   dataIndex: 'num11',
    //   key: 'num11',
    //   width: 120,
    //   render: (text) => <>{text}</>,
    // },
    // {
    //   title: '保供通行证登录次数',
    //   dataIndex: 'num12',
    //   key: 'num12',
    //   width: 120,
    //   render: (text) => <>{text}</>,
    // }
  ];

  // 单选日期改变
  const onDateChange = (e) => {
    let {value} = e.target
    switch (value) {
      case 1:
        // time = [moment(new Date()).subtract(1, 'days'), moment()]
        time = [getTime(1,'start'), getTime(1,'end')]
        break;
      case 2:
        time = [getTime(7,'start'), getTime(1,'end')]
        break;
      case 3:
        time = [getTime(30,'start'), getTime(1,'end')]
        break;
      default:
        break;
    }
    setDateValue(e.target.value);
    setStartTime(moment(time[0]).format('YYYY-MM-DD HH:mm:ss'));
    setEndTime(moment(time[1]).format('YYYY-MM-DD HH:mm:ss')) 
  };


  // 时间选择器选择时间
  const onTimeChange = (e) => {
    setDateValue(4);
    setStartTime(moment(e[0]).format('YYYY-MM-DD HH:mm:ss'));
    setEndTime(moment(e[1]).format('YYYY-MM-DD HH:mm:ss')) 
  }

  return (
    <div className={styles['outside-div']}>
      <div className={`${styles['filter-wrapper']} ${styles['com-shadow']}`}>
          <Row>
            <Col span={4}>
              <Radio.Group onChange={onDateChange} value={dateValue}>
                <Radio value={1}>近一日</Radio>
                <Radio value={2}>近一周</Radio>
                <Radio value={3}>近一月</Radio>
              </Radio.Group>
            </Col>
            
            <Col span={8}>
              <span style={{whiteSpace: 'nowrap' }}>选择日期：</span>
              <RangePicker
                  value={[moment(startDate),moment(endDate)]}
                  showTime={{
                    hideDisabledOptions: true,
                    defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                  }}
                  format="YYYY-MM-DD HH:mm:ss"
                  onChange={onTimeChange}
                />
            </Col>
           </Row>
      </div>
      <div className={styles['middle-box']}>
        <div className={styles.left}>
          <div className={`${styles.left_inner_box}  ${styles['com-shadow']}`}>
            <div className={styles.title}>累计访问量</div>
            <div className={styles.bot_div}>
              {trafficAndRatesData?.visitsCount || '-'}
            </div>
          </div>
          <div className={`${styles.left_inner_box}  ${styles['com-shadow']}`}>
            <div className={styles.title}>系统访问率</div>
            <div className={styles.bot_div}>
              {((isNaN(trafficAndRatesData.accessRate)?0:trafficAndRatesData.accessRate)*100).toFixed(2) + '%' }
            </div>
          </div>
        </div>
        <div className={`${styles['line-charts']}  ${styles['com-shadow']}`}>
          <div className={styles.title}>访问量统计</div>
          {trafficData?.xData?.length > 0 ?(
            <Chart
              data={{
                x: trafficData.xData,
                y: trafficData.yData,
              }}
            />
          ): <TableTab
              dataSource={[]}
            />}

        </div>
        <div className={`${styles['line-charts']}  ${styles['com-shadow']}`}>
          <div className={styles.title}>功能访问热度排行榜</div>
          <TableTab
            columns={columnsTop10}
            dataSource={functionAccessData || []}
            rowKey='count'
            line
          />
        </div>
        <div className={`${styles['line-charts']}  ${styles['com-shadow']}`}>
          <div className={styles.title}>各区使用频次排行</div>
          <TableTab
            columns={columnsArea}
            dataSource={orgAccessData || []}
            rowKey='org'
            line
          />
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={tableData}
        className={`${styles['table-wrapper']}  ${styles['com-shadow']}`}
        loading={loading}
        rowKey='org'
        pagination={false}
        // pagination={{ showSizeChanger: true, showQuickJumper: true, showTotal: (total) => `共 ${total} 条` }}
        scroll={{ x: 'max-centent'}}
      />
    </div>
  );
};

export default observer(LogManagement);
