import { call, put, takeLatest } from 'redux-saga/effects';

import api from '../api';

import { creators as commitActions } from './commits';

// Action types
export const types = {
  ADD_REQUESTED: 'repositories/ADD_REQUESTED',
  ADD_SUCCESS: 'repositories/ADD_SUCCESS',
  ADD_ERROR: 'repositories/ADD_ERROR',
};

// Action creators
export const creators = {
  addRepository: (payload) => ({ type: types.ADD_REQUESTED, payload }),
  addRepositorySuccess: (payload) => ({ type: types.ADD_SUCCESS, payload }),
  addRepositoryError: (error) => ({ type: types.ADD_ERROR, error }),
};

// Sagas
export function* addRepositorySaga(action) {
  try {
    const response = yield call(api.addRepository, action.payload);
    // It only makes sense to dispatch the action if the repository was created in this request
    const repository = response.data;
    if (response.status === 201) {
      yield put(creators.addRepositorySuccess(repository));
    }
    // After retrieving the data of the repository, dispatch the action to get the commits from that repository
    yield put(commitActions.addPastMonthCommits(repository));
  } catch (error) {
    yield put(creators.addRepositoryError(error.response.data));
  }
}

export function* repositoriesSaga() {
  yield takeLatest(types.ADD_REQUESTED, addRepositorySaga);
}
