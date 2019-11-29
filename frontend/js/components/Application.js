import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Switch, Route, Link } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { Container } from 'reactstrap';

import { history } from '../store';
import routes from '../routes';
import { creators } from '../store/ducks/user';

import Navbar from './Navbar';
import LoadingWrapper from './LoadingWrapper';
import Footer from './Footer';

const Application = () => {
  const dispatch = useDispatch();
  // Get the current authenticated user's data
  const user = useSelector((state) => state.user);
  useEffect(() => {
    const action = creators.fetchUser();
    dispatch(action);
  }, [user.login]);
  return (
    <ConnectedRouter history={history}>
      <LoadingWrapper>
        <div className="app-container">
          <div className="flex-grow-1">
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
          </div>
          <Footer />
        </div>
      </LoadingWrapper>
    </ConnectedRouter>
  );
};

export default Application;
