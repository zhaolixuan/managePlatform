import { useState, useEffect } from 'react';
import { Table, Switch, Popconfirm } from '@jd/find-react';
import moment from 'moment';
import { observer } from 'mobx-react';
import { useStore } from '@/hooks';
import { toJS } from 'mobx';
import styles from './index.module.less';

const SystemManagement = () => {

  const store = useStore('system');

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
        title: '状态',
        dataIndex: 'configvalue',
        key: 'configvalue',
        render: (text, item) => (
          <Popconfirm
            title={`您确定要切换为${text == 'y' ?'日常场景':'疫情场景'}`}
            onConfirm={()=>{confirm(item)}}
            onCancel={cancel}
            okText="确定"
            cancelText="取消"
            placement="right"
          >
            <Switch checkedChildren="疫情场景" unCheckedChildren="日常场景" checked={text == 'y' ?true:false}/>
          </Popconfirm>
        ),
    },
    
    {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
    },
    {
        title: '描述',
        dataIndex: 'describe',
        key: 'describe',
    },
  ];

  // 二次确认
  const confirm = (item) => {
    console.log(item);
    store.setController({
      configkey: item.configkey,
      configvalue: item.configvalue == 'y'? 'n':'y'
    }).then(()=>{
      store.getList();
    })
      // message.success('');
  };
  
  const cancel = (e) => {
    console.log(e);
    // message.error('Click on no');
  };

  // 分页改变
  const changePage = (pageObj) => {
    store.update({
        pagination: pageObj
    });
    store.getList({
        ...pageObj,
    });
  }

  useEffect(() => {
    store.getList();
  }, []);

  return (
    <div classname={styles['outside-div']}>
      <div  classname={styles['middle-box']}>
        <Table
          dataSource={store.tableData}
          loading={store.loading}
          pagination={{
              ...store.pagination,
              showSizeChanger: true,
              showQuickJumper: true,
              showLessItems: true,
              showTotal: (total) => `共 ${total} 条`
          }}
          rowKey='id'
          onChange={changePage}
          columns={columns} />
      </div>
    </div>
  );
};

export default observer(SystemManagement);
