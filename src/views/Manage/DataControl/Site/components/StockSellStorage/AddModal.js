import { Modal, Form, Input, DatePicker,Space,Table,Tooltip,message } from '@jd/find-react';
import ModalFooter from '@/views/Manage/componets/ModalFooter';
import moment from 'moment';
import { observer } from 'mobx-react';
import { useStore } from '@/hooks';
import { toJS } from 'mobx';
import { useEffect,useState } from 'react';
import styles from './AddModal.module.less'

const AddModal = ({ visible, name,title, businessId,businessType, setVisible, reportDate }) => {
  const [form] = Form.useForm();
  const [btnDisabled, setBtnDisabled] = useState(false);
  const siteStore = useStore('manageSite');
  const siteTypeList =  siteStore?.sealingTypeList?.map(item => ({
        value: item.childrenCode * 1, label: item.childrenName
  }))
  const time = moment().format('YYYY-MM-DD')
  form.setFieldsValue({businessName: name})
  form.setFieldsValue({businessType: siteTypeList?.filter(item => item.value === businessType)[0]?.label})
  const store = useStore('stockSellStorage');


  const onCancel = () => {
    setVisible(false);
  }
 
  const onOk = () => {
    const list = [...store.goodsModelList];
    form.validateFields().then(async values => {
      await store.batchSaveSupplyChainDetail({'goodsDetails': list , 'businessName':name, 'businessId':Number(businessId), 'reportDate':moment(values.reportDate).format('YYYY-MM-DD')},title)
      form.resetFields();
      setVisible(false);
    })
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
        render: (text,record,index) => {
         return ( <>
          { title == '查看更多' ? text || '-' : 
          title == '新增' ? <Input placeholder={'请输入'} onChange={({target:{value}})=>onChange(value,index,'purchase')} />
          :<Input defaultValue={text} placeholder={'请输入'} onChange={({target:{value}})=>onChange(value,index,'purchase')} />}
          </>)
        }
        
    },
    {
        title: '销售量',
        dataIndex: 'sale',
        key: 'sale',
        width: 180,
        editable: true,
        inputType: 'input',
        render: (text,record,index) => {
          return ( <>
           { title == '查看更多' ? text || '-' : 
           title == '新增' ? <Input placeholder={'请输入'} onChange={({target:{value}})=>onChange(value,index,'sale')} />
           :<Input defaultValue={text} placeholder={'请输入'} onChange={({target:{value}})=>onChange(value,index,'sale')} />}
           </>)
         }
    },
    {
        title: '库存量',
        dataIndex: 'inventory',
        key: 'inventory',
        width: 180,
        editable: true,
        inputType: 'input',
        render: (text,record,index) => {
          return ( <>
           { title == '查看更多' ? text || '-' : 
           title == '新增' ? <Input placeholder={'请输入'} onChange={({target:{value}})=>onChange(value,index,'inventory')} />
           :<Input defaultValue={text} placeholder={'请输入'} onChange={({target:{value}})=>onChange(value,index,'inventory')} />}
           </>)
         }
    },
  ];

  const onChange = (value,index,type)=> {
      console.log(value,index,type,'======value,index,type');
      // const reg =/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/;
      const reg =/^\d+(\.\d{1,2})?$/;
      if(reg.test(value) || value === ''){
        console.log('校验正确');
        const list = store.goodsModelList
        list[index][type] = value
        store.updatePage({
          goodsModelList: list
        })
        setBtnDisabled(false)
      }else{
        // message.error('');
        setBtnDisabled(true)
      }
  };

  useEffect(() => {
    console.log(title,'点击的按钮');
    if(!visible){
      store.updatePage({
        goodsModelList: []
      })
      return;
    };
    form.setFieldsValue({businessName: name})
    form.setFieldsValue({businessType: siteTypeList?.filter(item => item.value === businessType)[0]?.label})
    siteStore.queryDictionaryList({
      parentCode: 'DICT_REGIONTYPE'
    })
    if(title !== '新增'){
      store.querySupplyChainGoodsDetail({
        businessId,
        reportDate
      });
      form.setFieldsValue({reportDate})
    }else{
      store.queryGoodsModel();
      form.setFieldsValue({reportDate:moment(time) })
    }
  }, [visible,title]);
  
  return (
    <Modal
      title={title}
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      footer={null}
      width='70%'
      destroyOnClose
      maskClosable={false}
    >
      <Form
        name='basic'
        className={styles['form-demo-basic']}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        form={form}
      >
         <Space align="baseline">
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
                rules={[{ required: true, message: '请选择统计时间' }]}
              >
                {title !== '新增' ?<Input disabled /> : <DatePicker name='reportDate' format='YYYY-MM-DD'/>}
            </Form.Item>
         </Space>
         <Table
            loading={store.loading}
            dataSource={store.goodsModelList}
            columns={columns}
            rowClassName='editable-row'
            scroll={{ x: 'max-centent', y: '500px' }}
            rowKey='SPDLCode'
            pagination={false}
        />
      </Form>
      <ModalFooter handleOk={onOk} handleCancel={onCancel} disabled={btnDisabled} showMore={title =='查看更多'}/>
    </Modal>
  );
};

export default observer(AddModal);
