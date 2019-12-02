import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Switch, Route, Link } from 'react-router-dom';
import { Container } from 'reactstrap';

import routes from '../routes';
import { creators } from '../store/ducks/user';
import Navbar from '../components/Navbar';
import LoadingWrapper from '../components/LoadingWrapper';

const MainView = () => {
  const dispatch = useDispatch();
  // Get the current authenticated user's data
  const user = useSelector((state) => state.user);
  useEffect(() => {
    const action = creators.fetchUser();
    dispatch(action);
  }, [user.login]);
  return (
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
  );
};

export default MainView;
