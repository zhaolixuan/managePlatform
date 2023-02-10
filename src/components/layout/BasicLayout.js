/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import qs from 'qs';
import { Layout } from '@jd/find-react';
import { withRouter } from 'react-router-dom';
import { Routes } from '@/router';
import { controlRoutes } from '@/router/configParts';
import withAuth from './withAuth';
import Header from './Header';
import styles from './BasicLayout.module.less';

const { Content } = Layout;

@inject('layout')
@observer
class BasicLayout extends Component {
  render() {
    const { layout, location } = this.props;
    const { iframe = 'false' } = qs.parse(location.search.substr(1));
    // console.log('', qs.parse(location.search.substr(1)));
    return (
      // @ts-ignore
      <Layout className={styles.layout}>
        {iframe === 'false' && <Header layout={layout} />}
        <Content className={styles['layout-content']}>
          <Routes routes={controlRoutes} />
        </Content>
      </Layout>
    );
  }
}
// @ts-ignore
export default withAuth(withRouter(BasicLayout));
