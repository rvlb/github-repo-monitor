import React from 'react';
import { hot } from 'react-hot-loader';

import Root from './Root';
import SentryBoundary from './utils/SentryBoundary';

const App = () => (
  <SentryBoundary>
    <Root />
  </SentryBoundary>
);

export default hot(module)(App);
