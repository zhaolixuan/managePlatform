# 自定义 Hooks 使用指南
----------------
## useFetchData

> 简介：基于 `axiox` 的接口请求 hooks。包含通用的接口请求操作：数据初始化、更新、错误捕获等；通过配置接口参数可便捷实现自定义数据获取；支持所有 `axios` 参数的配置；

### 1. API 说明
  |  参数   | 说明  | 类型   | 可选值  | 默认值 | 
  |  ----  | ----  | ----  | ----  |----  |
  |  url  | 接口地址  | str  | ----  |----  |
  |  params  | 请求参数  |  object | ----  |----  |
  |  method  | 请求方法  | str | get, post, put, patch  | get  |
  |  dependences  | 依赖的参数  | array | ----  | ----  |
  |  validate  | 参数校验。返回 true 继续执行接口请求，否则停止请求。  | function | ----  | ----  |
  |  beforeReq  | 发送请求之前要做的事  | function  | ----  | ----  |
  |  transform  | 请求成功后，对数据的格式化转换，在`transformponse`之前执行  | function  | ----  | ----  |
  |  afterRes  | 请求成功后的回调  | function  | ----  | ----  |
  |  errorCatch  | 请求失败后的自定义捕获操作  | function  | 默认弹出**错误信息**  | ----  |
  |  extraAxiosOptions  | `axios`的其他自定义参数，比如: header  | object  | ----  | ----  |
  |  defaultData  | 返回数据的默认值  | any  | ----  | ----  |

### 2. 返回结果
  |  结果   | 说明  | 类型   | 可选值  | 默认值 | 
  |  ----  | ----  | ----  | ----  |----  |
  |  data  | 返回数据结果  | any  | ----  |----  |
  |  setData  | 更新数据的操作  | function  | ----  |----  |

### 3. 使用说明
``` javascript
import React from 'react';
import { message } from '@jd/find-react';
import { useFetchData } from '@/hooks';

function Test2() {
  const params = { pageNum: 1, pageSize: 10 };
  const [data] = useFetchData({
    url: '/mock-table-list',
    params,
    method: 'post',
    defaultData: {},
    transform: res => ({ ...res, ext: '前端加上去的' }),
    afterRes: () => message.success('请求成功了！'),
    errorCatch: (err) => message.error(`错误信息被用户捕获：${err.message}`),
    extraAxiosOptions: {
      headers: { token: 'I am JD-Icity' }
    }
  }, []);

  return (
    <div>{JSON.stringify(data)}</div>
  );
}

export default Test2;

``` 

## useStore

> 简介：可在React hook 中便捷使用 store；等同于 inject('storeName')

### 1. API 说明
  |  参数   | 说明  | 类型   | 可选值  | 默认值 | 
  |  ----  | ----  | ----  | ----  |----  |
  |  name  | 模块 store 名称  | str  | ----  |----  |

### 2. 返回结果
  |  结果   | 说明  | 类型   | 可选值  | 默认值 | 
  |  ----  | ----  | ----  | ----  |----  |
  |  store  | 对应`name`模块的 store 数据  | any  | ----  |----  |

### 3. 使用说明
``` javascript
import React from 'react';
import { useStore } from '@/hooks';

function Component {
  const { ... } = useStore('storeName');
  ...
}

export default observer(Component);

``` 

## useIsMounted

> 简介： useIsMounted 的结果返回 组件的**挂载** 或者 **卸载** 状态，

### 1. 返回结果
  |  结果   | 说明  | 类型   | 可选值  | 默认值 | 
  |  ----  | ----  | ----  | ----  |----  |
  |  staus  | 组件状态  | boolean  | true(挂载/didMount)、false(卸载/unMount)  |----  |

### 2. 使用说明
``` javascript
import React from 'react';
import { useIsMounted } from '@/hooks';

function Component {
  const isMounted = useIsMounted();
  if (isMounted) {
    // do something only when component is mounted
  }
  ...
}

export default observer(Component);

``` 

