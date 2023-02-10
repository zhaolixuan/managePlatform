/* eslint-disable */
import { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import { useStore } from '@/hooks'
import { Upload, Modal, message, Button, IconFont, Form, DatePicker } from '@jd/find-react';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import ModalFooter from '@/views/Manage/componets/ModalFooter';
import styles from './upFileModal.module.less';
import { getNowFormatDay } from '@/utils/Time'
import moment from "moment"
const upFileModal = ({ visible, setVisible, getList, title = '' }) => {
    const store = useStore('grainoil');
    const [fileList, setFileList] = useState([]);
    const [form] = Form.useForm();
    
    const handleOk = () => {
      form.validateFields().then((values) => {
        if(fileList && !fileList.length) {
          message.error('请上传导入文件')
          return;
        }
        // console.log('values=>', values);
        // ???
        setVisible(false);
        setFileList([]);
      }).catch((info) => {
        console.log('Validate Failed:', info);
      });
    };

    const handleCancel = () => {
        setVisible(false);
        setFileList([]);
    };

    const customRequest = async (info) => {
      const planDate = form.getFieldValue(['planDate']);

        if (!planDate) {
            return message.warning('请先选择上传日期')
        }
        const suffixList = ['xlsx', 'xls'];
        if (!suffixList.includes(info.file.name.split('.')[1])) return message.error('文档类型不正确！')
        const file = new FormData();
        file.append('excel', info.file);
        file.append('planDate', moment(planDate).format('YYYY-MM-DD'));
        try {
            const res = await store.exportExcel(file);
            res.type === 0 && message.success('导入成功');
            res.type === 1 && message.success(res.msg);
            setFileList([
                {
                    uid: '1',
                    name: info.file.name,
                    status: res.type === 1 ? 'error' : 'done',
                }
            ]);
            getList(res.date);
            handleOk();
        } catch (error) {
            console.log(error);
        }
    };

    //主要是拿current去做比较，得到一个时间段
    const disabledDate = (current) => {
        //moment做一些限定， 选择时间要大于等于当前天。若今天不能被选择，去掉等号即可。  
        return current && current >= moment().endOf('day');
    }

    const removeFile = () => {
        setFileList([]);
    }

    useEffect(() => {
      if(visible){
        form.setFieldsValue({
          planDate: moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD')
        })
      }
    }, [visible]);

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
            <Form
              form = {form}
              labelCol={{
                  span: 6,
              }}
              wrapperCol={{
                  span: 12,
              }}
              layout="horizontal"
            >
              <Form.Item label="上传日期" name='planDate' rules={[
                {
                    required: true,
                },
              ]}>
                <DatePicker disabledDate={disabledDate} />
                {/* <DatePicker disabledDate={disabledDate} defaultValue={moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD')} format='YYYY-MM-DD' onChange={DatePickerOnChange} /> */}
              </Form.Item>
            </Form>

            <Upload.Dragger
                name='file'
                action='#'
                customRequest={customRequest}
                fileList={fileList}
                onRemove={removeFile}
                style={{ width: 336, height: 176, margin: 'auto' }}
            >
                <div>
                    <p className="ant-upload-drag-icon">
                        <IconFont type="iconupload-Lined" />
                    </p>
                    <p className="ant-upload-text">单击或拖动文件到此区域以导入</p>
                    <p className="ant-upload-hint">
                        支持扩展名：.xls .xlsx ，文件不大于10M
                    </p>
                </div>
            </Upload.Dragger>
            <div className={styles.info}>
                <i>请按模板文件的规范准备需要导入的内容</i>
                <Button type='link' href={`${process.env.REACT_APP_FILE_URL}/supporfile_test/suppor-file/file/生活必需品政府储备调控计划表.xlsx`}>点击下载模版</Button>
            </div>
            <ModalFooter handleCancel={handleCancel} />
            {/* <ModalFooter handleOk={handleOk} handleCancel={handleCancel} /> */}
        </Modal>
    );
};

export default observer(upFileModal);
