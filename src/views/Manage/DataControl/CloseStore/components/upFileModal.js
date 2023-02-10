/* eslint-disable */
import { useState } from 'react';
import { observer } from 'mobx-react';
import { useStore } from '@/hooks';
import { Upload, Modal, message, Button, IconFont } from '@jd/find-react';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import ModalFooter from '@/views/Manage/componets/ModalFooter';
import styles from './upFileModal.module.less';

const upFileModal = ({ visible, setVisible, getList, title = '' }) => {
  const store = useStore('closeStore');
  const [fileList, setFileList] = useState([]);
  const handleOk = () => {
    setVisible(false);
    setFileList([]);
  };

  const handleCancel = () => {
    setVisible(false);
    setFileList([]);
  };

  const customRequest = async (info) => {
    const suffixList = ['xlsx', 'xls'];
    if (!suffixList.includes(info.file.name.split('.')[1])) return message.error('文档类型不正确！');
    const file = new FormData();
    file.append('excel', info.file);
    try {
      const res = await store.validExcel(file);
      if (res.type === 2) {
        Modal.confirm({
          title: '警告',
          icon: <ExclamationCircleOutlined />,
          width: 550,
          content: res.msg,
          async onOk() {
            try {
              const res = await store.exportExcel(file);
              res.type === 0 && message.success('导入成功');
              res.type === 1 && message.success(res.msg);
              setFileList([
                {
                  uid: '1',
                  name: info.file.name,
                  status: res.type === 1 ? 'error' : 'done',
                },
              ]);
              getList(res.date);
              handleOk();
            } catch (error) {
              console.log(error);
            }
          },
          onCancel() {
            setFileList([]);
          },
        });
      } else if (res.type === 1) {
        res.type === 1 && message.error(res.msg);
        console.log(555);
        setFileList([]);
      } else {
        const res = await store.exportExcel(file);
        res.type === 0 && message.success('导入成功');
        res.type === 1 && message.success(res.msg);
        setFileList([
          {
            uid: '1',
            name: info.file.name,
            status: res.type === 1 ? 'error' : 'done',
          },
        ]);
        getList(res.date);
      }

      setFileList([
        {
          uid: '1',
          name: info.file.name,
          status: res.type === 1 ? 'error' : 'done',
        },
      ]);
    } catch (error) {
      message.error(error.message);
    }
  };

  const removeFile = () => {
    setFileList([]);
  };
  return (
    <Modal
      title={title}
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      width='640px'
      style={{ height: 400 }}
      wrapClassName={styles.up_file}
      footer={null}
    >
      <Upload.Dragger
        name='file'
        action='#'
        customRequest={customRequest}
        fileList={fileList}
        onRemove={removeFile}
        style={{ width: 336, height: 176, margin: 'auto' }}
      >
        <div>
          <p className='ant-upload-drag-icon'>
            <IconFont type='iconupload-Lined' />
          </p>
          <p className='ant-upload-text'>单击或拖动文件到此区域以导入</p>
          <p className='ant-upload-hint'>支持扩展名：.xls .xlsx ，文件不大于10M</p>
        </div>
      </Upload.Dragger>
      <div className={styles.info}>
        <i>请按模板文件的规范准备需要导入的内容</i>
        <Button
          type='link'
          href='https://s3.cn-north-1.jdcloud-oss.com/suppor-file/template/%E9%97%AD%E5%BA%97%E6%95%B0%E6%8D%AE%E6%A8%A1%E7%89%88.xlsx'
        >
          点击下载模版
        </Button>
      </div>
      <ModalFooter handleCancel={handleCancel} />
      {/* <ModalFooter handleOk={handleOk} handleCancel={handleCancel} /> */}
    </Modal>
  );
};

export default observer(upFileModal);
