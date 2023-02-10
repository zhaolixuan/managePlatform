import React, { useState, useEffect } from 'react';
import { Button, Modal, Tree, message } from '@jd/find-react';
import { CarryOutOutlined, FormOutlined } from '@ant-design/icons';
import styles from '../index.module.less';
import { useStore } from '@/hooks';
import { getTree } from '@/api/dictionary'

const { TreeNode } = Tree;

const TreeModal = ({ visible, setVisible, id }) => {
    const [expandedKeys, setExpandedKeys] = useState([]);
    const [checkedKeys, setCheckedKeys] = useState([]);
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [defaultExpandAll, setDefaultExpandAll] = useState(false);

    const [autoExpandParent, setAutoExpandParent] = useState(true);
    const [treeData, setTreeData] = useState([]);
    const store = useStore('dictionary');

    const recursive = (data) => {
        // console.log(data, 'adata')
        data.forEach(item => {
            item['title'] = item.childrenName
            item['key'] = item.id
            // console.log(item)
            if (item.supportDictionaryChildVO && item.supportDictionaryChildVO.length) {
                item['children'] = item.supportDictionaryChildVO
                recursive(item.supportDictionaryChildVO)
            }
        })
    }

    const onExpand = (expandedKeys) => {
        console.log('onExpand', expandedKeys); // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.

        setExpandedKeys(expandedKeys);
        setAutoExpandParent(false);
    };

    const onCheck = (checkedKeys) => {
        console.log('onCheck', checkedKeys);
        setCheckedKeys(checkedKeys);
    };

    const getTreeData = () => {
        getTree({ id: id }).then(res => {
            console.log(res)
            recursive(res)
            setTreeData(res)
            setDefaultExpandAll(true)
        })
    }

    useEffect(() => {
        if (id) {
            getTreeData()
            setCheckedKeys([])
        }
    }, [id]);

    const handleDelete = () => {
        console.log(checkedKeys)
        if (!checkedKeys.length) {
            message.error('请勾选后删除')
            return false
        }
        Modal.confirm({
            title: '确定解除关联吗?',
            className: styles.confirm_wrap,
            async onOk () {
                try {
                    await store.removeBinding(checkedKeys);
                    message.success('解除关联成功');
                    setCheckedKeys([])
                    getTreeData()
                } catch (error) {
                    console.log(error);
                }
            }
        });
    };

    const onSelect = () => {

    }

    const onOk = () => {

    }

    const onCancel = () => {
        setVisible(false);
    }

    return (
        <Modal
            title='子集树'
            visible={visible}
            onOk={onOk}
            onCancel={onCancel}
            width='40%'
            className={styles.tree_modal}
            footer={null}
        >
            <Button onClick={handleDelete} type='primary' className={styles.delete_btn}>
                解除父级关联
            </Button>
            {/* autoExpandParent={true} */}
            <Tree
                checkable
                onExpand={onExpand}
                defaultExpandAll={defaultExpandAll}
                onCheck={onCheck}
                checkedKeys={checkedKeys}
                onSelect={onSelect}
                selectedKeys={selectedKeys}
                treeData={treeData}
            >
            </Tree>
        </Modal>
    );
};

export default TreeModal;
