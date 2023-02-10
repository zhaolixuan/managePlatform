/* eslint-disable no-restricted-globals */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-use-before-define */
import {
    Form,
    Input,
    Button,
    message,
    Modal,
    Select,
    DatePicker
} from '@jd/find-react';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useEffect, useState, useRef } from 'react';
import { observer } from 'mobx-react';
import { useStore } from '@/hooks';
import { getNowFormatDay } from '@/utils/Time'

import TableList from './components/TableList';
import UpFileModal from './components/upFileModal';
import styles from './index.module.less';
import { verificationPath } from '@/utils/Permission';
const Site = () => {
    const [showUpFile, setShowUpFile] = useState(false);
    const store = useStore('grainoil');
    const [searchFrom] = Form.useForm();
    const searchinput = useRef()

    // 当赛选条件发生改变是调用列表接口
    const DatePickerOnChange = (n) => {
        let values = {
            planDate: n ? getNowFormatDay(new Date(n)) : n
        }
        store.update({
            requestParama: { ...store.requestParama, ...values },
        });
        store.regionsPageList({ ...store.requestParama, ...values, ...store.pagination });
    };

    const search = (value) => {
        store.update({
            requestParama: { ...store.requestParama, businessName: value },
        });
        store.regionsPageList({ ...store.requestParama, businessName: value, ...store.pagination });
    };


    useEffect(() => {
        store.regionsPageList();
        // store.queryDictionaryList({
        //     parentCode: 'DICT_XZQY'
        // });
        // store.queryDictionaryList({
        //     parentCode: 'DICT_REGIONTYPE'
        // });
        return () => {
            store.reset();
        }
    }, []);
    return (
        <div className={styles.site}>
            <div className={styles.table_list}>
                <div className={styles.search_form}>
                    <div className={styles.btns}>
                        <Button icon={<PlusOutlined />} type='primary' onClick={() => setShowUpFile(true)}>
                            导入粮油数据
                        </Button>

                    </div>
                    <Form name='basic' className='form-demo-basic' form={searchFrom} layout='inline' >
                        {/* <Form.Item name='area'>
                            <Select placeholder='请选择所在行政区' allowClear style={{ width: 194 }}>
                                {store?.areaList?.map((item) => (
                                    <Select.Option value={item.childrenName} key={item.childrenCode}>
                                        {item.childrenName}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item name='businessType'>
                            <Select placeholder='请选择场所类型' allowClear style={{ width: 194 }}>
                                {store?.sealingTypeList?.map((item) => (
                                    <Select.Option value={item.childrenCode} key={item.childrenCode}>
                                        {item.childrenName}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item> */}

                        <Form.Item name='planDate'>
                            <DatePicker format={'YYYY-MM-DD'} onChange={DatePickerOnChange} />
                        </Form.Item>
                    </Form>
                </div>
                <TableList showrowSelection={true} searchinput={searchinput} />
            </div>
            <UpFileModal visible={showUpFile} setVisible={setShowUpFile} getList={() => store.regionsPageList()} title='粮油数据导入' />
        </div>
    );
};

export default observer(Site);
