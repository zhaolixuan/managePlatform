import { Modal } from '@jd/find-react';

const addModal = ({ visible, setVisible, details = {}, onCancel }) => {
    const keys = [
        {
            title: '分类',
            dataIndex: 'logType',
            key: 'logType',
        },
        {
            title: '接口名称',
            dataIndex: 'logName',
            key: 'logName',
        },
        {
            title: '请求url',
            dataIndex: 'requestUrl',
            key: 'requestUrl',
        },
        {
            title: '请求参数',
            dataIndex: 'requestParams',
            key: 'requestParams',
        },
        {
            title: '请求结果',
            dataIndex: 'requestResult',
            key: 'requestResult',
        },
        {
            title: '方法路径',
            dataIndex: 'javaMethodPath',
            key: 'javaMethodPath',
        },
        {
            title: '自定义日志内容',
            dataIndex: 'logContent',
            key: 'logContent',
        },
        {
            title: '服务器ip',
            dataIndex: 'serverIp',
            key: 'serverIp',
        },
        {
            title: '客户端ip',
            dataIndex: 'clientIp',
            key: 'clientIp',
        },
        {
            title: '用户id',
            dataIndex: 'userId',
            key: 'userId',
        },
        {
            title: '请求方法',
            dataIndex: 'httpMethodType',
            key: 'httpMethodType',
        },
        {
            title: '客户浏览器标识',
            dataIndex: 'clientBrowser',
            key: 'clientBrowser',
        },
        {
            title: '客户操作系统',
            dataIndex: 'clientOs',
            key: 'clientOs',
        },
        {
            title: '请求时间',
            dataIndex: 'requestTime',
            key: 'requestTime',
        },
        {
            title: '结束请求时间',
            dataIndex: 'createTime',
            key: 'createTime',
        },
        {
            title: '耗时',
            dataIndex: 'consuming',
            key: 'consuming',
        },
    ]
    const handleCancel = () => {
        setVisible(false);
        onCancel && onCancel();
    }
    return (
        <Modal
            title="详情"
            visible={visible}
            onCancel={handleCancel}
            footer={null}
            width='70%'
        >
            {
                keys.map(({ title, key }) => (
                    <p key={key}>{title}: {details[key]}</p>
                ))
            }
        </Modal>
    )
}

export default addModal; 