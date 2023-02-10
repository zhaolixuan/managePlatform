import { PlusOutlined } from '@ant-design/icons';
import { Modal, Upload, message } from '@jd/find-react';
import React, { useState, useEffect } from 'react';
import { fileUpload, deleteFile } from '@/api/upload';
import styles from './index.module.less'

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

const UploadApp = ({ maxCount = 9, fileData, multiple = false, UploadText = '上传图片', onChange, fileTypes = [] }) => {
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
    try {
      await deleteFile({ type: 'picture', fileName: file.response.fileName });
      const files = fileList.filter(item => item.response.fileName !== file.response.fileName);
      setFileList(files);
      onChange && onChange(files);
    } catch (error) {
      console.log(error);
    }
  };

  const customRequest = async (info) => {
   
    if (fileTypes.length && !fileTypes.includes(info.file.name?.split('.')[1])) return;
    let type
    if (info.file.type.includes('image')) {
        type = 'picture'
    }else if(info.file.type.includes('video')){
        type = 'video'
    }else{
        type = 'file'
    }
    let data = new FormData();
    data.append('files', info.file);
    try {
      let res = await fileUpload({ type: type, file: data });
      setFileList([
        ...fileList,
        {
          uid: new Date().getTime(),
          response: {
            fileName: res.fileName,
          },
          thumbUrl: res.url,
          status: 'done'
        },
      ])
      onChange && onChange([
        ...fileList,
        {
          uid: new Date().getTime(),
          response: {
            fileName: res.fileName,
          },
          thumbUrl: res.url,
          status: 'done'
        },
      ]);
    } catch (error) {
      setFileList([
        ...fileList,
        {
          uid: new Date().getTime(),
          response: {
            fileName: res.fileName,
          },
          thumbUrl: res.url,
          status: 'error'
        },
      ]);
      onChange && onChange([
        ...fileList,
        {
          uid: new Date().getTime(),
          response: {
            fileName: info.file.name,
          },
          thumbUrl: '',
          status: 'error'
        },
      ]);
      console.log(error);
    }

  };

  const handleChange = ({ fileList: newFileList, file }) => {
    console.log(newFileList, 'handleChange', file);
    if (file?.name && fileTypes.length && !fileTypes.includes(file.name?.split('.')[1])) return message.error(`只支持${fileTypes.join(', ')}格式`);
    setFileList(newFileList);
  };

  useEffect(() => {
    fileData && setFileList(fileData);
  }, [fileData]);

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        {UploadText}
      </div>
    </div>
  );
  return (
    <>
      <Upload
        action='#'
        listType='picture-card'
        multiple={multiple}
        fileList={fileList}
        customRequest={customRequest}
        onPreview={handlePreview}
        onChange={handleChange}
        onRemove={handleoRemove}
      >
        {fileList.length >= maxCount ? null : uploadButton}
      </Upload>
      { fileTypes.length && <div className={styles.info}>
      只支持{fileTypes.join(', ')}格式
      </div>}
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
