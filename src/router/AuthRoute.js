import React, { Component } from 'react';
import { Route } from 'react-router-dom';

export default class AuthRoute extends Component {
  render() {
    const { component: Comp, noAuth, tabs, keepAliveSystem, showTabs, ...rest } = this.props;

    return <Route {...rest} render={(props) => <Comp {...props} />} />;
  }
}
