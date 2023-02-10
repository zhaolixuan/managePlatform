import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import manage from './configParts/manage';
import { getFlatMenu } from './constant';

class RouteWithSubRoutes extends React.Component {
  render() {
    const { routes, history } = this.props;
    const manageMenus = JSON.parse(sessionStorage.getItem('manageMenus')) || {};
    return (
      <Switch>
        {routes.map((route) => {
          const { path, exact } = route;
          return (
            <Route
              key={path || '404'}
              exact={!!exact}
              path={path}
              render={(props) => {
                const Comp = route.component;
                const path = window.location.hash.split('#')[1];
                if (getFlatMenu(manage, 'routes').filter(item => item.path === path).length && !getFlatMenu(manageMenus?.children).filter(item => path === item.frontendUrl).length) {
                  history.push('/manage/404');
                }
                return <Comp {...props} routes={route.routes} meta={route.meta} />;
              }}
            />
          );
        })}
      </Switch>
    );
  }
}
export default withRouter(RouteWithSubRoutes);
