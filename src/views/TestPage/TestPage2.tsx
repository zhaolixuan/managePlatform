import React from 'react';
import { message } from '@jd/find-react';
import { useFetchData } from '@/hooks';

interface IProps {
  detail: {
    a: number;
  };
}
function Test2(props: IProps) {
  const { detail } = props;
  const params = { pageNum: 1, pageSize: 10 };
  const [data] = useFetchData(
    {
      url: '/mock-table-list',
      params,
      method: 'post',
      defaultData: {},
      transform: (res) => ({ ...res, ext: '前端加上去的' }),
      afterRes: () => message.success('请求成功了！'),
      errorCatch: (err) => message.error(`错误信息被用户捕获：${err.message}`),
      extraAxiosOptions: {
        headers: { token: 'I am JD-Icity' },
      },
    } as any,
    [],
  );
  return (
    <div>
      <p>props: detail {JSON.stringify(detail)}</p>
      <p>测试接口mock数据</p>
      {JSON.stringify(data)}
    </div>
  );
}

export default Test2;
