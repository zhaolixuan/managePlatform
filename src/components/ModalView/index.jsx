import { Modal, Button } from '@jd/find-react';
import React, { useState, useEffect } from 'react';
import styles from './index.module.less'
import FileViewer from 'react-file-viewer';
import PDF from 'react-pdf-js';

/**
 * @params {Boolean} visible 弹框显示
 * @params {String} filePath 文件地址
 * @params {String} type 文件类型 'xlsx', 'xls', 'docx', 'doc', 'pdf'
 * @params {Function} onChange 关闭回调
 * @returns
 */

const ModalView = ({ visible, filePath, type, onChange}) => {
  console.log(filePath);
  const [pages, setPages] = useState(0);
  const [page, setPage] = useState(1);
  const handleCancel = () => {
    onChange()
  }

  //获取所有页
  const onDocumentComplete = (pages) => {
    setPages(pages)
  }
  //点击上一页
  const handlePrevious = () => {
    setPage(page - 1)
  }
  //点击下一页
  const handleNext = () => {
    setPage(page + 1)
  }

  useEffect(() => {
  }, []);
  return (
    <>
      <Modal visible={visible} width='60%' className={styles.modal} title='预览' footer={null} onCancel={handleCancel}>
        <div className={styles.filesBox}>
          {
            type == 'docx' || type == 'doc' || type == 'xlsx' || type == 'xls' ?//判断类型是否为docx
              // <div className={styles.flieContent}>
              //   <FileViewer
              //     fileType='docx'//文件类型
              //     // filePath={xiangmu2} //文件地址
              //     filePath={filePath} //文件地址
              //   />
              // </div>
              // : type == 'xlsx' || type == 'xls' ?//判断类型是否为xlsx
              //   <div className={styles.flieXlsxContent}>
              //     <FileViewer
              //       fileType='xlsx'//文件类型
              //       filePath={filePath} //文件地址
              //     />
              //   </div>
              <iframe src={filePath}  width='100%' height="700px"></iframe>
                : type == 'pdf' ?
                  <div>
                    <div className={styles.filePdf} style={{textAlign:'center'}}>
                      <PDF
                        file={filePath}
                        onDocumentComplete={onDocumentComplete}
                        page={page}
                      />
                    </div>
                    <div className={styles.filePdfFooter}>
                      {page === 1 ?
                        null
                        :
                        <Button type='primary' onClick={handlePrevious}>上一页</Button>
                      }
                      <div className={styles.filePdfPage}>
                        <span>第{page}页</span>/<span>共{pages}页</span>
                      </div>
                      {page === pages ?
                        null
                        :
                        <Button style={{ marginLeft: '10px' }} type='primary' onClick={handleNext}>下一页</Button>
                      }
                    </div>
                  </div>
                  : <div className='file-view-warn'>暂无文件预览</div>
          }
        </div>
      </Modal>
    </>
  );
};

export default ModalView;
