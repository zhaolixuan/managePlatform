import React, { useContext, useState, useEffect, useRef } from 'react';
import { Table, Input, Button, Popconfirm, Form, Select, AutoComplete, message, Switch } from '@jd/find-react';
const EditableContext = React.createContext();
import { queryParentIdByChildName } from '@/api/dictionary'
import styles from './AddModal.module.less'



const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    if ({ ...props }?.children[0]?.props?.record?.isAddStatus === true) {
        const parentIdName = { ...props }.children[0].props.record.parentIdName
        const parentId = { ...props }.children[0].props.record.parentId
        form.setFieldsValue({
            parentIdName,
            parentId
        })
    }
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};


const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    inputType,
    message,
    placeholder,
    record,
    width,
    handleSave,
    ...restProps
}) => {
    const [editing, setEditing] = useState(false);
    const [parentIdOptions, setParentIdOptions] = useState([]);
    // const [status, setStatus] = useState(0);
    const parentIdChange = (e) => {
        if (!e) return setTimeout(() => {
            setParentIdOptions([])
        }, 300);
        // setParentIdOptions([])
        // setParentIdOptions(data)
        queryParentIdByChildName(e).then(res => {
            console.log(res)
            res = res.map((item, index) => {
                return {
                    value: item.childrenName,
                    label: item.childrenName,
                    parentId: item.parentId
                }
            })
            setParentIdOptions(res)
        })
    }

    const inputRef = useRef();
    const form = useContext(EditableContext);
    // const inputNodeList = {
    //   input: <Input ref={inputRef} onPressEnter={save} onBlur={save}></Input>,
    //   autoInput: <AutoComplete ref={inputRef} onChange={parentIdChange} style={{ width: 200 }} onBlur={save} placeholder="?????????" options={parentIdOptions} />,
    //   select: <Select ref={inputRef} placeholder={`?????????${title}`} onChange={save} onBlur={save} options={[{value: 1, label: '??????'}, {value: 2, label: '??????'}] || []} />,
    // }
    // const inputNode = inputNodeList[inputType];
    // console.log(title,inputType, inputNode)
    useEffect(() => {
        if (editing) {
            inputRef.current.focus();
        }
    }, [editing]);

    const toggleEdit = () => {
        console.log(record, dataIndex)
        if (!record?.edit) {
            setEditing(!editing);
            form.setFieldsValue({
                [dataIndex]: record[dataIndex],
            });

        }
    };

    function getUrlParams2 (url) {
        let urlStr = url.split('?')[1]
        const urlSearchParams = new URLSearchParams(urlStr)
        const result = Object.fromEntries(urlSearchParams.entries())
        return result
    }
    const type = getUrlParams2(window.location.href).type

    const save = async (e) => {
        try {
            const values = await form.validateFields();
            handleSave({ ...record, ...values });
            toggleEdit();
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };

    function onChange (value) {
        console.log(`selected ${value}`, parentIdOptions);
        let data = parentIdOptions.filter(item => item.label === value)
        record['parentId'] = data[0].parentId
    }

    function onBlur () {
        console.log('blur');
    }

    function onFocus () {
        console.log('focus');
    }
    const changeIsKy = (value) => {
        record['status'] = value
        save()
    }

    function onSearch (val) {
        console.log('search:', val);
    }

    let childNode = children;

    const messageData = {
        childrenName: [{
            required: true,
            message: message,
        }],
        childrenCode: [{
            required: true,
            // pattern: /^DICT_/,
            // pattern: /^DICT_[A-Z]+$/,
            message: message,
        }],
        status: [{
            required: true,
            // pattern: /^DICT_/,
            // pattern: /^DICT_[A-Z]+$/,
            message: message,
        }],
    }

    if (editable) {
        childNode = editing || record?.edit ? (
            <Form.Item
                className={styles.cellItem}
                label={dataIndex === 'childrenName' || dataIndex === 'childrenCode' || dataIndex === 'status' ? ' ' : ''}
                style={{
                    margin: 0,
                }}
                name={dataIndex}
                rules={dataIndex === 'childrenName' || dataIndex === 'childrenCode' || dataIndex === 'status' ? messageData[dataIndex] : [
                    {
                        required: false,
                        message: `?????????`,
                    }
                ]}
            >
                {
                    // title === '????????????' ? <AutoComplete ref={inputRef} onChange={parentIdChange} style={{ width: 200 }} onBlur={save} placeholder="???????????????????????????" options={parentIdOptions} /> :
                    title === '????????????' && record.isAddStatus === true ? (<div>{record.parentIdName}</div>) :
                        title === '????????????' ?
                            <Select
                                ref={inputRef}
                                showSearch
                                style={{ width }}
                                placeholder={placeholder}
                                optionFilterProp="children"
                                onChange={onChange}
                                onFocus={onFocus}
                                onBlur={save}
                                onSearch={parentIdChange}
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {parentIdOptions.map(d => (
                                    <Option key={d.value}>{d.label}</Option>
                                ))}
                            </Select> :
                            title === '??????' ? <Select ref={inputRef} disabled style={{ width }} placeholder={placeholder} defaultValue={type * 1} options={[{ value: 1, label: '??????' }, { value: 2, label: '??????' }] || []} /> :
                                title === '????????????' ? <Select ref={inputRef} style={{ width }} onChange={changeIsKy} placeholder={placeholder}  options={[{ value: 0, label: '???' }, { value: 1, label: '???' }] || []} /> :
                                    <Input ref={inputRef} style={{ width }} placeholder={placeholder} onPressEnter={save} onBlur={save}></Input>
                }

            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{
                    paddingRight: 24,
                    height: '20px'
                }}
                onClick={toggleEdit}
            >
                {children}
            </div>
        );
    }

    return <td {...restProps}>{childNode}</td>;
};

class AddTable extends React.Component {
    constructor(props) {
        super(props);
        let typeObj = {
            1: '??????',
            2: '??????'
        }

        this.columns = [
            {
                title: '???????????????',
                dataIndex: 'childrenName',
                editable: true,
                inputType: 'input',
                width: 200,
                placeholder: '?????????????????????',
                message: '??????????????????'
            },
            {
                title: '???????????????',
                dataIndex: 'childrenCode',
                editable: true,
                inputType: 'input',
                width: 200,
                placeholder: '?????????????????????',
                message: '?????????????????????'
            },
            {
                title: '??????',
                dataIndex: 'sort',
                editable: true,
                width: 150,
                inputType: 'input',
                placeholder: '?????????????????????'
            },
            {
                title: '??????',
                dataIndex: 'details',
                editable: true,
                width: 150,
                inputType: 'input',
                placeholder: '??????'
            },
            {
                title: '??????',
                dataIndex: 'type',
                editable: true,
                width: 150,
                inputType: 'select',
                placeholder: '?????????',
                render: text => <>{typeObj[text] || '-'}</>
            },
            {
                title: '????????????',
                dataIndex: 'parentIdName',
                editable: true,
                width: 200,
                inputType: 'autoInput',
                placeholder: '??????',
            },
            {
                title: '????????????',
                dataIndex: 'status',
                editable: true,
                placeholder: '?????????',
                width: 200,
                inputType: 'autoInput',
                message: '??????????????????',
                render: text => <>{text ? '???' : '???'}</>
            },
            {
                title: '??????',
                align:'center',
                dataIndex: 'operation',
                render: (text, record) =>
                    this.state.dataSource.length >= 1 && !this.props?.update ? (
                        <Popconfirm title="?????????????" onConfirm={() => this.handleDelete(record.key)}>
                            <a>??????</a>
                        </Popconfirm>
                    ) : null,
            },
        ];
        this.state = {
            dataSource: props?.rowInfo ? [props.rowInfo] : [],
            count: 0,
            // ??????????????????
            addSourceObj: {
                parentIdName: '',
                parentId: ''
            },
            type: null
        };
    }
    handleDelete = (key) => {
        const dataSource = [...this.state.dataSource];
        this.setState({
            dataSource: dataSource.filter((item) => item.key !== key),
        }, () => {
            this.props.handleSave(this.state.dataSource)
        });
    };
    handleAdd = () => {
        const { count, dataSource, addSourceObj, type } = this.state;
        // ??????????????????????????????
        if (addSourceObj.parentIdName) {
            const newData = {
                key: count,
                childrenName: '',
                childrenCode: '',
                sort: '',
                details: '',
                type: type,
                parentId: addSourceObj.parentId,
                ex: '',
                edit: true,
                parentIdName: addSourceObj.parentIdName,
                isAddStatus: true,
                status: 0
            };
            this.setState({
                dataSource: [...dataSource, newData],
                count: count + 1,
            });

        } else {
            const newData = {
                key: count,
                childrenName: '',
                childrenCode: '',
                sort: '',
                details: '',
                type: type,
                parentId: '',
                ex: '',
                edit: true,
                status: 0

            };
            this.setState({
                dataSource: [...dataSource, newData],
                count: count + 1,
            });
        }

    };
    handleSave = (row) => {
        const newData = [...this.state.dataSource];
        const childrenCodeData = newData.filter(el => el.key !== row.key).map(item => {
            return item.childrenCode
        })
        if (childrenCodeData.includes(row.childrenCode)) {
            message.error('???????????????????????????!')
        }
        console.log(childrenCodeData)
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        this.setState({
            dataSource: newData,
        });
        this.props.handleSave(newData)
        console.log(this.state, '111')
    };
    componentDidMount () {
        function getUrlParams2 (url) {
            let urlStr = url.split('?')[1]
            const urlSearchParams = new URLSearchParams(urlStr)
            const result = Object.fromEntries(urlSearchParams.entries())
            return result
        }
        var query = getUrlParams2(window.location.href)
        this.setState({ type: query.type })

        this.addSourceFun()
    }
    addSourceFun () {
        const { dataSource } = this.state
        // ?????????????????????
        if (dataSource[0]?.update === false) {
            this.setState({
                dataSource: [],
                addSourceObj: {
                    parentIdName: dataSource[0].childrenName,
                    parentId: dataSource[0].id
                }
            })
        }
    }

    render () {
        const { dataSource } = this.state;
        console.log('dataSource',dataSource)

        const components = {
            body: {
                row: EditableRow,
                cell: EditableCell,
            },
        };
        const columns = this.columns.map((col) => {
            if (!col.editable) {
                return col;
            }

            return {
                ...col,
                onCell: (record) => ({
                    record,
                    editable: col.editable,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    inputType: col.inputType,
                    inputType: col.width,
                    message: col?.message,
                    placeholder: col.placeholder,
                    handleSave: this.handleSave,
                }),
            };
        });
        return (
            <div>
                <Button
                    onClick={this.handleAdd}
                    type="primary"
                    style={{
                        marginBottom: 16,
                        display: this.props?.update ? 'none' : 'block'
                    }}
                    disabled={this.props.update}
                >
                    ?????????
                </Button>
                <Table
                    components={components}
                    rowClassName={() => 'editable-row'}
                    bordered
                    pagination={false}
                    dataSource={dataSource}
                    columns={columns}
                />
            </div>
        );
    }
}

// ReactDOM.render(<AddTable />, mountNode);
export default AddTable;