/* eslint-disable no-restricted-globals */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-use-before-define */
import {
    Form,
    Input,
    Button,
    Select,
    DatePicker
} from '@jd/find-react';
import { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { useStore } from '@/hooks';
import TableList from './components/TableList'
import AddModal from './components/AddModal';
import styles from './index.module.less';
import { verificationPath } from '@/utils/Permission';
const ReplenishmentManagement = () => {

    const [visible, setVisible] = useState(false);
    const store = useStore('configconst');
    const [searchFrom] = Form.useForm();
    const [permissionData, setPermissionData] = useState({});
    const [searchParams, setSearchParams] = useState({})


    // 当赛选条件发生改变是调用列表接口
    const formChange = (_, values) => {
        // store.update({ ...store.requestParama, ...values })
        // store.update({ requestParama: {...values} })
        setSearchParams(values)

    };
    const getPermission = () => {
        let data = verificationPath();
        let arr = {};
        data?.forEach((i) => {
            arr[i?.code] = true;
        });
        setPermissionData(arr);
    };

    const handleSearch = () => {
        store.update({ requestParama: searchParams, pagination: { current: 1, pageSize: 10 } })
        store.listPage();
    }

    useEffect(() => {
        getPermission();
    }, []);

    return (
        <div className={styles.site}>
            <div className={styles.table_list}>
                <div className={styles.search_form}>
                    <div className={styles.btns}>

                        <Button style={{ display: !permissionData.ReplenishmentAdd ? 'inline-block' : 'none' }} type='primary' onClick={() => {
                            setVisible(true);
                        }}>
                            新增
                        </Button>
                    </div>
                    <Form name='basic' className='form-demo-basic' form={searchFrom} layout='inline' onValuesChange={formChange}>
                        <Form.Item name='type'>
                            <Select placeholder='请选择类型' onChange={(value) => { store.update({ requestParama: { ...searchParams, type: value }, pagination: { current: 1, pageSize: 10 } }) }} allowClear style={{ width: 194 }}>
                                {store?.typeOptions.map((item) => (
                                    <Select.Option value={item.value} key={item.label}>
                                        {item.label}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item name='configkeyLike'>
                            <Input
                                placeholder='配置key'
                            />
                        </Form.Item>
                        <Form.Item name='configvalueLike'>
                            <Input
                                placeholder='配置value'
                            />
                        </Form.Item>

                        <Form.Item onClick={handleSearch}>
                            <Button>搜索</Button>
                        </Form.Item>


                    </Form>
                </div>
                <TableList permissionData={permissionData} />
            </div>
            <AddModal visible={visible} setVisible={setVisible} />
        </div>
    );
};

export default observer(ReplenishmentManagement);
