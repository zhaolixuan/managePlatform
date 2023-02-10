import { PlusOutlined } from '@ant-design/icons';
import { Modal, Button, IconFont, Upload, message } from '@jd/find-react';
import React, { useState, useEffect } from 'react';
import { fileUpload, deleteFile } from '@/api/upload';
import styles from './index.module.less'
import { StarOutlined } from '@ant-design/icons';
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => resolve(reader.result);

    reader.onerror = (error) => reject(error);
  });

/**
 * @params {Number} maxCount 图片上传最大数量
 * @params {Arrar} fileData 图片回显数据 
 *        [
            {
              uid: '1',
              response: {
                fileName: '-577741570-1654856825872.png',
              },
              thumbUrl: 'https://s3.cn-north-1.jdcloud-oss.com/suppor-file/picture/-577741570-1654856825872.png',
            },
          ]
 * @params {Arrar} fileTypes 图片回显数据  样例格式：['png', 'jpg']
 * @params {Boolean} multiple 是否支持多选
 * @params {String} UploadText 是否支持多选
 * @params {Function} onChange 上传文件的回调
 * @returns
 */

const UploadApp = ({ maxCount = 9, fileData=[], multiple = false, UploadText = '上传图片', onChange, fileTypes = [], index }) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState([]);

  const handleCancel = () => setPreviewVisible(false);

  const handlePreview = async (file) => {
    // if (!file.url && !file.preview) {
    //   file.preview = await getBase64(file.originFileObj);
    // }
    setPreviewImage(file.thumbUrl);
    setPreviewVisible(true);
    // setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    setPreviewTitle(file.response.fileName);
  };

  const handleoRemove = async (file) => {
    if (!file.uid) return;
    try {
      await deleteFile({ type: 'picture', fileName: file?.response?.fileName });
      const files = fileList.filter(item => item?.response?.fileName !== file?.response?.fileName);
      setFileList(files);
      onChange && onChange(files, index);
    } catch (error) {
      onChange && onChange([], index);
      console.log(error);
    }
  };

  const customRequest = async (info) => {
    console.log(info);
    const extname = info?.name?.split('.')
    if (fileTypes.length && extname && !fileTypes.includes(extname[extname.length - 1])) return;
    let type
    if (info.file.type.includes('image')) {
      type = 'picture'
    } else if (info.file.type.includes('video')) {
      type = 'video'
    } else if(info.file.type.includes('pdf')) {
      // 如果是PDF的话，就用file接口的路径，如果不是PDF用其他的接口路径
      type = 'file'
      console.log('这是PDF');
    }else {
      type = 'preview/file'
      console.log('这是文档');
    }
    let data = new FormData();
    data.append('files', info.file);
    try {
      let res = await fileUpload({ type: type, file: data });
      if (fileList.length >= maxCount) {
        console.log(2);
        fileList.pop();
      }
      setFileList([
        ...fileList,
        {
          uid: new Date().getTime(),
          response: {
            fileName: info.file.name || res.fileName,
          },
          name: info.file.name || res.fileName,
          thumbUrl: res.url,
          status: 'done',
          previewUrl:res.previewUrl || ''
        },
      ])
      onChange && onChange([
        ...fileList,
        {
          uid: new Date().getTime(),
          response: {
            fileName: info.file.name || res.fileName,
          },
          name: info.file.name || res.fileName,
          thumbUrl: res.url,
          status: 'done',
          previewUrl:res.previewUrl || ''
        },
      ], index);
    } catch (error) {
      console.log(error, 'error')
      if (fileList.length >= maxCount) {
        fileList.pop();
      }
      setFileList([
        ...fileList,
        {
          uid: new Date().getTime(),
          response: {
            fileName: info.file.name || res.fileName,
          },
          name: info.file.name || res.fileName,
          thumbUrl: res.url,
          status: 'error',
          previewUrl:res?.previewUrl || ''
        },
      ]);
      onChange && onChange([
        ...fileList,
        {
          uid: new Date().getTime(),
          response: {
            fileName: info.file.name || res.fileName,
          },
          name: info.file.name || res.fileName,
          thumbUrl: '',
          status: 'error',
          previewUrl: ''
        },
      ], index);
      console.log(error);
    }

  };

  const handleChange = ({ fileList: newFileList, file }) => {
    console.log(newFileList, 'handleChange', file, fileList.length, maxCount);
    const extname = file?.name?.split('.')
    if (file?.name && fileTypes.length && extname && !fileTypes.includes(extname[extname.length - 1])) return message.error(`只支持${fileTypes.join(', ')}格式`);
    if (fileList.length >= maxCount) {
      newFileList.shift();
    }
    setFileList(newFileList);
  };

  useEffect(() => {
    fileData && setFileList(fileData);
  }, [fileData]);

  const uploadButton = (
    <div>
      <Button>
        <IconFont type="iconupload-Lined" /> {UploadText}
      </Button>
      {fileTypes.length && <div className={styles.info}>
        只支持{fileTypes.join(', ')}格式
      </div>}
    </div>
  );
  return (
    <>
      <Upload
        action='#'
        multiple={multiple}
        fileList={fileList}
        customRequest={customRequest}
        // onPreview={handlePreview}
        onChange={handleChange}
        onRemove={handleoRemove}
        showUploadList={{
          removeIcon: <span onClick={handleoRemove} >删除</span>,
        }}
      >
        {uploadButton}
      </Upload>
      <Modal visible={previewVisible} title={previewTitle} footer={null} onCancel={handleCancel}>
        <img
          alt='example'
          style={{
            width: '100%',
          }}
          src={previewImage}
        />
      </Modal>
    </>
  );
};

export default UploadApp;
