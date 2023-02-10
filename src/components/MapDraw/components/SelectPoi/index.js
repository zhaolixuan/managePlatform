/* eslint-disable */
import React,{useState} from 'react';
import { Select } from '@jd/find-react';

const SelectPoi = ({placeholder,style,defaultData,searchMethod}) => {
  const [value,setValue] = useState();
  const [data,setData] = useState([]);
  const options = data.map(d => <Option key={d.value}>{d.text}</Option>);
  const handleSearch = async (value) => {
    const res = await searchMethod('京东');
  }
  const handleChange = () => {
    
  }
  return (
    <Select
      showSearch
      value={value}
      placeholder={placeholder || '请输入地址'}
      style={style}
      defaultValue={defaultData}
      defaultActiveFirstOption={false}
      showArrow={false}
      filterOption={false}
      // onSearch={handleSearch}
      onChange={handleChange}
      notFoundContent={null}
      onBlur={handleSearch}
    >
      {options}
    </Select>
  );
};

export default SelectPoi;
