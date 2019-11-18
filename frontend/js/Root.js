import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';

import reducer from './reducers';
import configureStore from './store';
import Home from './pages/Home';

const Root = () => {
  return (
    <Provider store={configureStore(reducer)}>
      <Router>
        <Switch>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
    </Provider>
  );
};

export default Root;
