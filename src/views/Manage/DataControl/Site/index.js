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
} from '@jd/find-react';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useEffect, useState, useRef } from 'react';
import { observer } from 'mobx-react';
import { useStore } from '@/hooks';

import { batchDeleteRegion } from '@/api/manageSite';
import TableList from './components/TableList';
import AddModal from './components/AddModal';
import UpFileModal from './components/upFileModal';
import styles from './index.module.less';
import { verificationPath } from '@/utils/Permission';
const Site = () => {
    const [visible, setVisible] = useState(false);
    const [showUpFile, setShowUpFile] = useState(false);
    const [ids, setIds] = useState([]);
    const store = useStore('manageSite');
    const [searchFrom] = Form.useForm();
    const [permissionData, setPermissionData] = useState({});
    const searchinput = useRef()


    // 当赛选条件发生改变是调用列表接口
    const formChange = (_, values) => {
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

    const handelDelect = () => {
        if (!ids.length) return message.error('请勾选需要批量删除的数据');
        try {
            Modal.confirm({
                title: '确定批量删除吗？',
                onOk () {
                    batchDeleteRegion(ids).then(async res => {
                        searchinput.current.input.input.value = ''
                        searchinput.current.input.state.value = ''
                        message.success(res);
                        await store.regionsPageList({ page: 1 })
                        setIds([]);
                    })

                },
            });
        } catch (error) {
            console.log(error);
        }
    }

    const onChangeIds = (ids) => {
        setIds(ids)
    }

    const getPermission = () => {
        let data = verificationPath();
        let arr = {};
        data.forEach((i) => {
            arr[i.code] = true;
        });
        setPermissionData(arr);
    };
    useEffect(() => {
        getPermission();
        store.regionsPageList();
        store.queryDictionaryList({
            parentCode: 'DICT_XZQY'
        });
        store.queryDictionaryList({
            parentCode: 'DICT_REGIONTYPE'
        });
        return () => {
            store.reset();
        }
    }, []);
    return (
        <div className={styles.site}>
            <div className={styles.table_list}>
                <div className={styles.search_form}>
                    <div className={styles.btns}>
                        {/* <Button type='primary' onClick={() => setVisible(true)}>
              批量导入
            </Button> */}
                        <Button icon={<PlusOutlined />} style={{ display: permissionData.SiteAdd ? 'block' : 'none', }} type='primary' onClick={() => setShowUpFile(true)}>
                            导入场所数据
                        </Button>
                        <Button style={{ display: permissionData.SiteAdd ? 'block' : 'none', }} type='primary' onClick={() => setVisible(true)}>
                            新增
                        </Button>
                        <Button icon={<DeleteOutlined />} style={{ display: permissionData.SiteBatchDelect ? 'block' : 'none' }} type='info' onClick={handelDelect}>
                            批量删除
                        </Button>
                    </div>
                    <Form name='basic' className='form-demo-basic' form={searchFrom} layout='inline' onValuesChange={formChange}>
                        <Form.Item name='area'>
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
                        </Form.Item>

                        <Form.Item>
                            <Input.Search ref={searchinput} onSearch={search} placeholder='搜索' />
                        </Form.Item>
                    </Form>
                </div>
                <TableList permissionData={permissionData} showrowSelection={true} onChangeIds={onChangeIds} searchinput={searchinput} />
            </div>
            <AddModal visible={visible} setVisible={setVisible} />
            <UpFileModal visible={showUpFile} setVisible={setShowUpFile} getList={() => store.regionsPageList()} title='本地导入场所数据' />
        </div>
    );
};

export default observer(Site);
