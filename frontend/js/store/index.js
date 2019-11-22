import createSagaMiddleware from 'redux-saga';
import { createStore, applyMiddleware } from 'redux';

import { rootReducer, rootSaga } from './ducks';

const middleware = createSagaMiddleware();
const store = createStore(rootReducer, {}, applyMiddleware(middleware));
middleware.run(rootSaga);

export default store;
