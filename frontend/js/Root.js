import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { Provider } from 'react-redux';
import { Container } from 'reactstrap';

import Navbar from './components/Navbar';
import LoadingWrapper from './components/LoadingWrapper';
import configureStore, { history } from './store';
import routes from './routes';

const store = configureStore({});
const Root = () => {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <div className="app-container">
          <LoadingWrapper>
            <Navbar>
              {routes.map(({ path, title, id }) => (
                <Link key={`nav-link-${id}`} to={path}>
                  {title}
                </Link>
              ))}
            </Navbar>
            <Container>
              <Switch>
                {routes.map(({ path, component: Component, id, exact = false }) => (
                  <Route key={`route-${id}`} exact={exact} path={path}>
                    <div className="component-wrapper">
                      <Component />
                    </div>
                  </Route>
                ))}
              </Switch>
            </Container>
          </LoadingWrapper>
        </div>
      </ConnectedRouter>
    </Provider>
  );
};

export default Root;
