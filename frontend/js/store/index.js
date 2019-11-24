import { createBrowserHistory } from 'history';
import createSagaMiddleware from 'redux-saga';
import { routerMiddleware } from 'connected-react-router';
import { createStore, applyMiddleware, compose } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import { createRootReducer, rootSaga } from './ducks';

export const history = createBrowserHistory();
const sagaMiddleware = createSagaMiddleware();
const composeEnhancers = process.env.NODE_ENV !== 'production' ? compose : composeWithDevTools;

const configureStore = (preloadedState) => {
  const store = createStore(
    createRootReducer(history),
    preloadedState,
    composeEnhancers(applyMiddleware(sagaMiddleware, routerMiddleware(history)))
  );
  sagaMiddleware.run(rootSaga);
  return store;
};

export default configureStore;
