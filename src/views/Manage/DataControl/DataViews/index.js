/* eslint-disable no-restricted-globals */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-use-before-define */
import { DatePicker, List } from '@jd/find-react';

import moment from 'moment';
import { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
// import { useStore } from '@/hooks';
import ModalView from '@/components/ModalView'
import { getList, getCodeList, downLoad } from '@/api/dataUpload'
// import { downloadExcel } from '@/utils/util'
import { NAME_LIST } from './config'

import styles from './index.module.less';

const { fileUrl } = window.GLOBAL_CONFIG;
const DataView = () => {
  // const store = useStore('manageSite');
  const [list, setList] = useState([]);

  const [type, setType] = useState('docx');
  const [visible, setVisible] = useState(false);
  const [filePath, setFilePath] = useState('');
  const [query, setQuery] = useState({
    agency: '',
    fileDate: moment().format('YYYY-MM-DD')
  });

  const routerName = () => {
    let str = location.hash
    const name = str.substring(str.lastIndexOf("/")+1)
    return name
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

  const onChange = (e, fileDate) => {
    setQuery({...query, fileDate})
    getData({...query, fileDate})
  }

  const getData = (query) => {
    if(routerName().includes('list')) {
      // 全部  先取所有的agency  然后去重   然后塞到data里
      getList({...query, fileDate: query.fileDate + ' 00:00:00'}).then(res => {
        let agencyArr = res.map(item => {
          return item.agency
        })
        let newAgencyArr = []
        for(let i=0; i<agencyArr.length; i++){
          if(!newAgencyArr.includes(agencyArr[i])){
              newAgencyArr.push(agencyArr[i])
          }
        }
        let data = []
        newAgencyArr.forEach(item => {
          let arr = res.filter(el => el.agency === item)
          data.push({title: arr[0].agencyName, data: arr})
        })
        setList(data)
      })
    } else {
      getList({...query, fileDate: query.fileDate + ' 00:00:00'}).then(res => {
        setList([{title: NAME_LIST[routerName()], data: res}])
      })
    }
  }

  const getCode = () => {
    getCodeList(['DICT_SJTJFXSC']).then(res => {
      let data = res.DICT_SJTJFXSC
      for(let i in data) {
        if(NAME_LIST[routerName()] === data[i].childrenName) {
        // if('市发展改革委' === data[i].childrenName) {
          setQuery({...query, agency: data[i].childrenCode})
          getData({...query, agency: data[i].childrenCode})
        }
      }
    })
  }
  const downLoadFile = async (url, item) => {
     downloadFile(url,item.fileName)
      function downloadFile(record, fileName) {
        var request = new XMLHttpRequest();
        request.responseType = "blob";//定义响应类型
        request.open("GET",  record);
        request.onload = function () {
          var url = window.URL.createObjectURL(request.response);
          var a = document.createElement("a");
          document.body.appendChild(a);
          a.href = url;
          a.download = fileName
          a.click();
        }
        request.send();
      }
  }
  useEffect(() => {
    if(routerName().includes('list')) {
      getData(query)
    } else {
      getCode()
    }
  }, []);
  return (
    <div className={styles.site}>
      <div className={styles.table_list}>
        <div className={styles.picker}>
          选择日期：
          <DatePicker onChange={onChange} defaultValue={moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD')} format='YYYY-MM-DD'/>
        </div>
        <div className={styles.content}>
          {list?.map((el, index) => { //item 相当于key
            return <div className={styles.content_item} key={index}>
              <h1>{el?.title}数据分析</h1>
              <List
                itemLayout="horizontal"
                dataSource={el?.data}
                renderItem={item => (
                  <List.Item
                    actions={[<a key="list-loadmore-edit" disabled={item.fileUrl? false : true} onClick={() => handleView(item)}>预览</a>, <a key="list-loadmore-more" disabled={item.fileUrl? false : true} onClick={() => downLoadFile(item.fileUrl, item)}>下载</a>]}
                  >
                    <List.Item.Meta
                      title={<a>{item.fileTypeName}</a>}
                    />
                  </List.Item>
                )}
              />
            </div>;
          })}

        </div>
      </div>
      <ModalView visible={visible} type={type} filePath={filePath} onChange={() => setVisible(false)}/>
    </div>
  );
};

export default observer(DataView);
