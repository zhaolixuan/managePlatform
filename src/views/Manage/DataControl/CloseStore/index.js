import { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import styles from './index.module.less';
import { Form, Input, Button, Select, Modal, message, DatePicker } from '@jd/find-react';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import TableList from './components/TableList';
import { useStore } from '@/hooks';
import moment from 'moment';
import AddModal from './components/AddModal';
import UpFileModal from './components/upFileModal';
import {debounce} from 'lodash';
// 关闭门店组件
const CloseStore = () => {
  const [searchFrom] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [showUpFile, setShowUpFile] = useState(false);
  const store = useStore('closeStore');
  // 当赛选条件发生改变是调用列表接口
  const formChange = (changedValues, values) => {
    store.regionsPageList({
      ...values,
      ...store.pagination,
      closeDate: values.closeDate ? moment(values.closeDate).format('YYYY-MM-DD') + ' 00:00:00' : '',
    });
  };

  useEffect(() => {
    console.log(665);
    // 获取表格数据
    store.regionsPageList();
    // // 行政区下拉选数据
    store.queryDictionaryList({
      parentCode: 'DICT_XZQY',
    });
  }, []);
  return (
    <div className={styles.closestore}>
      <div className={styles.table_list}>
        <div className={styles.search_form}>
          <div>
            <Button icon={<PlusOutlined />} type='primary' onClick={() => setShowUpFile(true)}>
            导入关停门店数据
            </Button>
            <Button type='primary' onClick={() => setVisible(true)}>
              新增
            </Button>
            {/* <Button icon={<DeleteOutlined />} type='info' onClick={handelDelect}>
              批量删除
            </Button> */}
          </div>
          <Form name='basic' className='form-demo-basic' form={searchFrom} layout='inline' onValuesChange={formChange}>
            <Form.Item name='area'>
              <Select placeholder='请选择所在行政区' allowClear style={{ width: 194 }}>
                {store?.areaList?.map((item) => (
                  <Select.Option value={item.childrenName} key={item.childrenCode}>
                    {item.childrenName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name='keyWord'>
              <Input.Search
                allowClear
                // onSearch={(value) => {
                //   // store.update({requestParama:{ ...store.requestParama, shopName: value }});
                //   store.regionsPageList({ shopName: value });
                // }}
                placeholder='搜索'
              />
            </Form.Item>
            <Form.Item name='closeDate'>
              <DatePicker allowClear />
            </Form.Item>
          </Form>
        </div>
        <TableList showrowSelection={true} searchFrom={searchFrom} />
      </div>
      <AddModal visible={visible} setVisible={setVisible} />
      <UpFileModal
        visible={showUpFile}
        setVisible={setShowUpFile}
        getList={() => store.regionsPageList()}
        title='本地导入关停门店数据'
      />
    </div>
  );
};
export default observer(CloseStore);
