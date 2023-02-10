import { Modal, Form, Input, DatePicker,Space,Table,Tooltip,message } from '@jd/find-react';
import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
import ModalFooter from '@/views/Manage/componets/ModalFooter';
import { observer } from 'mobx-react';
import moment from 'moment';
import { useStore } from '@/hooks';
import { useEffect,useState } from 'react';
import { toJS } from 'mobx';
import styles from './showMoreModal.module.less'

const ShowMoreModal = ({ visible, name, businessId,businessType, setVisible, showMore, reportDate }) => {
  console.log(reportDate,'=======');
  const [form] = Form.useForm();
  const [btnDisabled, setBtnDisabled] = useState(false);
  const siteStore = useStore('manageSite');
  const siteTypeList =  siteStore?.sealingTypeList?.map(item => ({
        value: item.childrenCode * 1, label: item.childrenName
  }))
  form.setFieldsValue({businessName: name})
  form.setFieldsValue({businessType: siteTypeList?.filter(item => item.value === businessType)[0]?.label})
  const store = useStore('stockSellStorage');

  const dateChange = (e,date) => {
    console.log(e,date);
    store.querySupplyChainGoodsDetail({
      businessId,
      reportDate:date
    });
  }

  const onCancel = () => {
    setVisible(false);
  }
 
  const onOk = () => {
    setVisible(false);
  }

  const columns = [
    {
        title: '一级类别',
        dataIndex: 'SPDLName',
        key: 'SPDLName',
        width: 152,
        render: text => <Tooltip title={text}>
            <div>
                {text}
            </div>
        </Tooltip>
    },
    {
        title: '商品类别',
        dataIndex: 'SPLBName',
        key: 'SPLBName',
        width: 152,
        render: text => <>{text || '-'}</>
    },
    {
        title: '商品名称',
        dataIndex: 'SPMCName',
        key: 'SPMCName',
        width: 152,
        render: text => <>{text || '-'}</>
    },
    {
        title: '单位',
        dataIndex: 'unit',
        key: 'unit',
        width: 182,
        render: text => <>{text || '-'}</>
    },
    {
        title: '进货量',
        dataIndex: 'purchase',
        key: 'purchase',
        width: 180,
        editable: true,
        inputType:'input',
        render: text => <>{text || '-'}</>
        
    },
    {
        title: '销售量',
        dataIndex: 'sale',
        key: 'sale',
        width: 180,
        editable: true,
        inputType: 'input',
        render: text => <>{text || '-'}</>
    },
    {
        title: '库存量',
        dataIndex: 'inventory',
        key: 'inventory',
        width: 180,
        editable: true,
        inputType: 'input',
        render: text => <>{text || '-'}</>
    },
  ];

  useEffect(() => {
    if(!visible) return;
    form.setFieldsValue({businessName: name})
    form.setFieldsValue({businessType: siteTypeList?.filter(item => item.value === businessType)[0]?.label})
    siteStore.queryDictionaryList({
      parentCode: 'DICT_REGIONTYPE'
    })
    store.querySupplyChainGoodsDetail({
      businessId,
      reportDate
    });
    form.setFieldsValue({reportDate: reportDate?moment(reportDate):''})
  }, [visible,showMore]);

  return (
    <Modal
      title={'查看更多'}
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      footer={null}
      style={{
        top: '20%',
      }}
      width='70%'
      zIndex= {100000000}
      destroyOnClose
      maskClosable={false}
    >
      <Form
        name='basic'
        className={styles['form-demo-basic']}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        form={form}
        initialValues={{reportDate: reportDate?moment(reportDate):''}}
      >
         <Space align="center" className={styles['form-Space']}>
            <Form.Item
              labelCol={{ span: 10 }}
              label='场所名称'
              name='businessName'
            >
              <Input disabled />
            </Form.Item>
            <Form.Item
              labelCol={{ span: 10 }}
              label='场所类型'
              name='businessType'
            >
              <Input disabled />
            </Form.Item>
            <Form.Item
              labelCol={{ span: 8}}
              label='统计时间'
              name='reportDate'
            >
            {/* <Input disabled /> */}
              <DatePicker  locale={locale} name='reportDate' format='YYYY-MM-DD' onChange={dateChange}/>
            </Form.Item>
            
         </Space>
         <Table
            loading={store.loading}
            dataSource={store.goodsModelList}
            columns={columns}
            rowClassName='editable-row'
            scroll={{ x: 'max-centent', y: '400px' }}
            rowKey='SPDLCode'
            pagination={false}
        />
      </Form>
      <ModalFooter handleOk={onOk} handleCancel={onCancel} disabled={btnDisabled} showMore={showMore}/>
    </Modal>
  );
};

export default observer(ShowMoreModal);
