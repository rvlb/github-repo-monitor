import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';

import { history } from './store';
import LoginView from './views/LoginView';
import MainView from './views/MainView';
import Footer from './components/Footer';

const Root = () => {
  return (
    <div className="app-container">
      <div className="flex-grow-1">
        <ConnectedRouter history={history}>
          <Switch>
            <Route path="/login">
              <LoginView />
            </Route>
            {/* Catch-all para todas as outras rotas */}
            <Route path="/">
              <MainView />
            </Route>
          </Switch>
        </ConnectedRouter>
      </div>
      <Footer />
    </div>
  );
};

export default Root;
