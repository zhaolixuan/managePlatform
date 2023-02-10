import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Table } from '@jd/find-react';
import { useStore } from '@/hooks';
import styles from './index.module.less';
import Test2 from './TestPage2';

const InterfaceList = () => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState();

  const {
    manage: { getInterfaceList },
    layout: { setBreadList, resetBreadList },
  } = useStore('');

  let query = useMemo(
    () => ({
      pageNum: 1,
      pageSize: 10,
    }),
    [],
  );

  const columns = useMemo(
    () => [
      {
        title: '序号',
        key: 'idx',
        dataIndex: 'idx',
        width: '10%',
        render: (text, record, idx) => idx + 1,
      },
      {
        title: '接口名称',
        key: 'apiName',
        dataIndex: 'apiName',
        width: '20%',
      },
      {
        title: '所属服务',
        key: 'serviceName',
        dataIndex: 'serviceName',
        width: '20%',
      },
      {
        title: '接口描述',
        key: 'apiDesc',
        dataIndex: 'apiDesc',
        width: '20%',
      },
      {
        title: '申请时间',
        key: 'created',
        dataIndex: 'created',
        width: '30%',
      },
    ],
    [],
  );

  const getList = useCallback(() => {
    getInterfaceList(query).then(({ totalCount, items }) => {
      setData(items);
      setTotal(totalCount);
    });
  }, [getInterfaceList, query]);

  const onTableChange = (pagination) => {
    const { current, pageSize } = pagination;
    query = Object.assign(query, {
      pageNum: current,
      pageSize,
    });
    getList();
  };

  useEffect(() => {
    getList();
  }, [getList]);
  useEffect(() => {
    setBreadList([{ name: '测试页面' }, { name: '重写' }]);
    return () => {
      resetBreadList();
    };
  }, []);
  return (
    <div>
      <Table
        className={styles.wrap}
        rowKey='id'
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: query.pageSize, total, showSizeChanger: true }}
        onChange={onTableChange}
      />
      <Test2 detail={{ a: 1 }} />
    </div>
  );
};

export default InterfaceList;
