import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import { all } from 'redux-saga/effects';

import { repositoriesReducer as repositories, repositoriesSaga } from './repositories';
import { commitsSaga } from './commits';

export const rootReducer = combineReducers({ form, repositories });

export function* rootSaga() {
  yield all([repositoriesSaga(), commitsSaga()]);
}
