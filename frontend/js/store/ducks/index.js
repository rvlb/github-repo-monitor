import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { reducer as form } from 'redux-form';
import { all } from 'redux-saga/effects';

import { repositoriesSaga } from './repositories';
import { commitsReducer as commits, commitsSaga } from './commits';
import { formSaga } from './utils';

export const createRootReducer = (history) => {
  return combineReducers({
    router: connectRouter(history),
    form,
    commits,
  });
};

export function* rootSaga() {
  yield all([repositoriesSaga(), commitsSaga(), formSaga()]);
}
