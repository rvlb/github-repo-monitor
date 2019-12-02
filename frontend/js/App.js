import React from 'react';
import { hot } from 'react-hot-loader';
import { Provider } from 'react-redux';

import Root from './Root';
import configureStore from './store';
import SentryBoundary from './utils/SentryBoundary';

const store = configureStore({});
const App = () => (
  <SentryBoundary>
    <Provider store={store}>
      <Root />
    </Provider>
  </SentryBoundary>
);

export default hot(module)(App);
