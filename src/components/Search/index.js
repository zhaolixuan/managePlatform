/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { Input } from '@jd/find-react';
import { CaretDownOutlined,SearchOutlined } from '@ant-design/icons';
import styles from './index.module.less';

const Search = ({ list = [], searchType = 'site', onSearch, onChange, showSeach, hiddenSelect, placeholder = '', selectChange }) => {
  const [active, setActive] = useState(null);
  const [value, setValue] = useState(0);
  const [show, setShow] = useState(false);
  const [inputText, setInpntText] = useState(null);
  const showItem = (e) => {
    setShow(true);
  };
  const select = (val, index) => {
    setActive(index);
    setValue(index);
    setShow(false);
    onChange({ value: val });
  };

  return (
    <div className={`${styles.search} ${styles[`${searchType}Search`]}`}>
      {!hiddenSelect && (
        <div className={styles.select} onClick={showItem}>
          <span className={styles.select_value}>{list[value]?.label}</span>
          <CaretDownOutlined className={styles.icon}/>
        </div>
      )}
       {showSeach && (
        <div className={styles.seachIcon} onClick={() => onSearch && onSearch({ businessName: inputText, value })}>
          <SearchOutlined className={styles.icon}/>
        </div>
      )}
      {show && (
        <ul className={styles.items}>
          {list?.map((item, index) => (
            <li
              onClick={() => {
                select(item.value, index);
                selectChange && selectChange(item.value);
              }}
              className={index === active ? styles.active : ''}
              key={index}
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}
      <Input
        className={styles.input}
        onPressEnter={({ target }) =>onSearch && onSearch({ businessName: target.value, value })}
        placeholder={placeholder}
        onChange={({ target }) => {onChange && onChange(target.value); setInpntText(target.value)}}
        // style={{ width: 334, height: 32 }}
      />
    </div>
  );
};

export default Search;
