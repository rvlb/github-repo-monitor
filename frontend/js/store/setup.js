import ReduxThunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';

import * as api from '../api';

const setup = (reducer, enhancer) => createStore(reducer, {}, enhancer);

const middleware = ReduxThunk.withExtraArgument({ api });

export default (reducer) => setup(
  reducer,
  applyMiddleware(middleware)
);
