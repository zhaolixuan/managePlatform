/* eslint-disable no-restricted-globals */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-use-before-define */
import { DatePicker, List, Popconfirm, message } from '@jd/find-react';
import moment from 'moment';
import Upload from './components/index';
import ModalView from '@/components/ModalView'
import { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { getList, submit, getCodeList } from '@/api/dataUpload'
import { NAME_LIST } from './config'

import styles from './index.module.less';

const routerName = () => {
  let str = location.hash
  const name = str.substring(str.lastIndexOf("/") + 1)
  return name
}
const DataUpload = () => {
  // const store = useStore('manageSite');
  const [data2, setData2] = useState([]);
  const [type, setType] = useState('docx');
  const [visible, setVisible] = useState(false);
  const [filePath, setFilePath] = useState('');
  const [title, setTitle] = useState('---');
  const [query, setQuery] = useState({
    agency: '',
    fileDate: moment().format('YYYY-MM-DD')
  });

  const onChange = (e, fileDate) => {
    setQuery({ ...query, fileDate })
    list({ ...query, fileDate })
  }
  const changeUpImgage = (file, index) => {
    data2.forEach((item, idx) => {
      if (idx === index) {
        item.fileName = file[0]?.name
        item.fileUrl = file[0]?.thumbUrl
        item.fileSuffix = file[0]?.thumbUrl.substring(file[0]?.thumbUrl.lastIndexOf(".") + 1)
        // item.previewUrl  =file[0]?.previewUrl || ''
        // console.log(file);
      }
    })
    console.log(112);
    console.log(data2);
    setData2([...data2])
  }
  const handleView = (item) => {
    const type = ['doc','docx','xls','xlsx']
      console.log(item);
      setType(item.fileSuffix)
      if(type.includes(item.fileSuffix)){
       const  URL = item.fileUrl.replace('.'+item.fileSuffix,'-html.html')
        setFilePath(URL)
      }else{
      setFilePath(item.fileUrl)

      }
      setVisible(true)
  }
  const confirm = (e) => {
    console.log(e);
    let { agency, fileType, fileName, fileSuffix, fileUrl } = e
    let params = {
      agency,
      fileType,
      fileName,
      fileSuffix,
      fileUrl:fileUrl,
      "fileDate": query.fileDate + ' 00:00:00',
    }
    submit([params]).then(res => {
      // if(res.code == 200) {
      message.success('提交成功');
      list(query)
      // }
    })
  }

  function cancel(e) {
    message.error('取消');
  }

  const list = (query) => {
    getList({ ...query, fileDate: query.fileDate + ' 00:00:00' }).then(res => {
      const result = res.map((item, index) => {
        let fileData = []
        if (item.fileUrl) {
          fileData = [
            {
              name: item.fileName,
              uid: new Date().getTime(),
              response: {
                fileName: item.fileName,
              },
              thumbUrl: item.fileUrl,
            },
          ]
        }
        return {
          ...item,
          index,
          fileData: fileData || []
        }
      })
      setData2(result)
    })
  }
  const getCode = () => {
    getCodeList(['DICT_SJTJFXSC']).then(res => {
      let data = res.DICT_SJTJFXSC
      for (let i in data) {
        if (NAME_LIST[routerName()] === data[i].childrenName) {
          setQuery({ ...query, agency: data[i].childrenCode })
          list({ ...query, agency: data[i].childrenCode })
        }
      }
      setTitle(NAME_LIST[routerName()])
    })
  }
  useEffect(() => {
    getCode()
  }, []);
  return (
    <div className={styles.site}>
      <div className={styles.table_list}>
        <div className={styles.picker}>
          选择日期：
          <DatePicker onChange={onChange} defaultValue={moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD')} format='YYYY-MM-DD' />
        </div>
        <h1>{title}数据分析上传(每日18:30前上传完成)</h1>
        <div className={styles.content}>
          <List
            itemLayout="horizontal"
            dataSource={data2}
            renderItem={(item) => (
              <List.Item
                actions={[<Popconfirm
                  title={item.fileUrl ? item.createTime ? `${item.fileTypeName}显示该日已上传确定继续上传？` : "确定继续上传?" : '确认删除吗?'}
                  onConfirm={() => confirm(item)}
                  onCancel={cancel}
                  okText="确 定"
                  cancelText="取 消"
                >
                  <a href="#">提交</a>
                </Popconfirm>, , <a key="list-loadmore-more" onClick={() => handleView(item)}>查看</a>]}
              >
                <List.Item.Meta
                  title={<a>{item.fileTypeName}</a>}
                />
                <Upload maxCount={1} index={item.index} fileData={item.fileData} UploadText='上传文件' fileTypes={['docx', 'doc', 'xlsx', 'xls', 'pdf']} onChange={changeUpImgage} />
              </List.Item>
            )}
          />,
        </div>
        <ModalView visible={visible} type={type} filePath={filePath} onChange={() => setVisible(false)} />
      </div>
    </div>
  );
};

export default observer(DataUpload);
