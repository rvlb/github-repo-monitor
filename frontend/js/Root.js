import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { Provider } from 'react-redux';

import Navbar from './components/Navbar';
import LoadingWrapper from './components/LoadingWrapper';
import configureStore, { history } from './store';
import routes from './routes';

const store = configureStore({});
const Root = () => {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <LoadingWrapper>
          <Navbar>
            {routes.map(({ path, title, id }) => (
              <Link key={`nav-link-${id}`} to={path}>
                {title}
              </Link>
            ))}
          </Navbar>
          <div className="container">
            <Switch>
              {routes.map(({ path, component: Component, id, exact = false }) => (
                <Route key={`route-${id}`} exact={exact} path={path}>
                  <Component />
                </Route>
              ))}
            </Switch>
          </div>
        </LoadingWrapper>
      </ConnectedRouter>
    </Provider>
  );
};

export default Root;
