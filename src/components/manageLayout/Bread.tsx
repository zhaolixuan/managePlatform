import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Breadcrumb, Button } from '@jd/find-react';
import styles from './Bread.module.less';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { pathToRegexp } = require('path-to-regexp'); // 这个库用了commonJS的语法，需要用这种引入方式

@inject('manageLayout')
@observer
class Bread extends React.Component<any, any> {
  LinkItem = ({ path, name, icon }) => {
    const { showIcon } = this.props;
    return (
      <Link to={path}>
        {showIcon && icon && <i className={`${styles.icon} iconfont ${icon}`}></i>}
        <span className={styles.breadname}>{name}</span>
      </Link>
    );
  };

  renderName = ({ path, name, icon, ...props }) => {
    const { component, lastIdx } = props;
    const { breadList, showIcon } = this.props;
    console.log(name, 'name')
    if(name === '缺补填报' || name === '进销存维护') {
      /* eslint-disable */
      const params = location.href.split('?name=')[1].split('&id=')
      name += `(${decodeURI(params[0])})`
    }else if(name == '列表查看'){
        const params = location.href.split('?parentName=')[1].split('&parentCode=')
        name += `(${decodeURI(params[0])})`
    }
    if (breadList) {
      return this.LinkItem({
        path,
        name,
        icon,
      });
    }
    if (!component || lastIdx) {
      return (
        <>
          {showIcon && icon && <i className={`${styles.icon} iconfont ${icon}`}></i>}
          <span className={styles.breadname}>{name}</span>
        </>
      );
    }
    return this.LinkItem({
      path,
      name,
      icon,
    });
  };

  renderItem = (breads) => {
    const filterBreads = breads.filter((i) => i.name);
    return filterBreads.map((bread, index) => (
      <Breadcrumb.Item key={index}>
        {this.renderName({
          ...bread,
          lastIdx: index === filterBreads.length - 1,
        })}
      </Breadcrumb.Item>
    ));
  };

  render() {
    // 如果以后有新的菜单需要在这里面加跳转路径
    const historyList = {
      缺补货管理: '/gis/site',
      封控数据管理: '/gis/enclosure',
      保供场所管理: '/gis/site',
      车辆司乘人员报备管理: '/gis/carOut',
      列表:'/gis/site',
      报备管理:'/gis/carOut',
      运营分析: '/gis/site',
      关停门店数据管理: '/gis/site'
    }; 

    const {
      location,
      manageLayout: { breadMap, breadList },
      className = '',
      history
    } = this.props;
    let breads;
    if (breadList && breadList.length) {
      // 若传入breadList 则为自定义面包屑 breadMap无效
      breads = breadList;
    } else {
      breads = breadMap && breadMap[location.pathname];
      if (breadMap && breadMap[location.pathname]) {
        breads = breadMap[location.pathname];
      } else {
        const firstMatchPath = Object.keys(breadMap).find((i) => {
          if (!i.includes(':')) return false;
          const reg = pathToRegexp(i); // 匹配规则
          return reg.exec(location.pathname);
        });
        breads = breadMap[firstMatchPath];
      }
    }

    if (!breads) return '';

    console.log(breads.filter((i) => i.name), 123);
    

    return <div className={`${styles['bread-wrap']} ${className}`}>
      <Breadcrumb>{this.renderItem(breads)}</Breadcrumb>
      <Button onClick={() => {history.push(historyList[breads.filter((i) => i.name)[1]?.name || '缺补货管理']||'/gis/site')}}>返回</Button>
    </div>;
  }
}

export default withRouter(Bread);
