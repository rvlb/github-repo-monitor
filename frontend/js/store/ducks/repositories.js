import { call, put, takeLatest } from 'redux-saga/effects';

import api from '../api';

import { creators as commitActions } from './commits';

// Action types
export const types = {
  ADD_REQUESTED: 'repositories/ADD_REQUESTED',
  ADD_SUCCESS: 'repositories/ADD_SUCCESS',
  ADD_ERROR: 'repositories/ADD_ERROR',

  FETCH_REQUESTED: 'repositories/FETCH_REQUESTED',
  FETCH_SUCCESS: 'repositories/FETCH_SUCCESS',
  FETCH_ERROR: 'repositories/FETCH_ERROR',
};

// Action creators
export const creators = {
  addRepository: (payload) => ({ type: types.ADD_REQUESTED, payload }),
  addRepositorySuccess: (payload) => ({ type: types.ADD_SUCCESS, payload }),
  addRepositoryError: (error) => ({ type: types.ADD_ERROR, error }),

  fetchRepositories: (payload) => ({ type: types.FETCH_REQUESTED, payload }),
  fetchRepositoriesSuccess: (payload) => ({ type: types.FETCH_SUCCESS, payload }),
  fetchRepositoriesError: (error) => ({ type: types.FETCH_ERROR, error }),
};

// Sagas
export function* fetchRepositoriesSaga() {
  try {
    const response = yield call(api.fetch('repositories'));
    yield put(creators.fetchRepositoriesSuccess(response.data));
  } catch (error) {
    yield put(creators.fetchRepositoriesError(error.response.data));
  }
}

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
  yield takeLatest(types.FETCH_REQUESTED, fetchRepositoriesSaga);
  yield takeLatest(types.ADD_REQUESTED, addRepositorySaga);
}
