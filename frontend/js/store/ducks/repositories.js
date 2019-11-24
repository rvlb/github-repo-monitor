import { call, fork, put, takeLatest, takeEvery } from 'redux-saga/effects';
import { stopSubmit } from 'redux-form';

import api from '../api';

import { creators as commitActions } from './commits';

// Action types
export const types = {
  ADD_REQUESTED: 'repositories/ADD_REQUESTED',
  ADD_SUCCESS: 'repositories/ADD_SUCCESS',
  ADD_ERROR: 'repositories/ADD_ERROR',

  FETCH_ALL_REQUESTED: 'repositories/FETCH_REQUESTED',
  FETCH_ALL_SUCCESS: 'repositories/FETCH_SUCCESS',
  FETCH_ALL_ERROR: 'repositories/FETCH_ERROR',
};

// Action creators
export const creators = {
  addRepository: (payload) => ({ type: types.ADD_REQUESTED, payload }),
  addRepositorySuccess: (payload) => ({ type: types.ADD_SUCCESS, payload }),
  addRepositoryError: (error) => ({ type: types.ADD_ERROR, error }),

  fetchRepositories: (payload) => ({ type: types.FETCH_ALL_REQUESTED, payload }),
  fetchRepositoriesSuccess: (payload) => ({ type: types.FETCH_ALL_SUCCESS, payload }),
  fetchRepositoriesError: (error) => ({ type: types.FETCH_ALL_ERROR, error }),
};

// Reducer and reducer handlers
export const repositoriesReducer = (state = [], action) => {
  switch (action.type) {
    case types.FETCH_ALL_SUCCESS:
      return [...action.payload];
    case types.ADD_SUCCESS:
      return [...state, action.payload];
    default:
      return state;
  }
};

// Sagas
export function* fetchRepositoriesSaga() {
  try {
    const response = yield call(api.fetchAll('repositories'));
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

export function* addRepositoryErrorSaga(action) {
  yield put(stopSubmit('repository-add', action.error));
}

export function* repositoriesSaga() {
  yield takeLatest(types.FETCH_ALL_REQUESTED, fetchRepositoriesSaga);
  yield takeLatest(types.ADD_REQUESTED, addRepositorySaga);
  yield takeEvery(types.ADD_ERROR, addRepositoryErrorSaga);

  yield fork(fetchRepositoriesSaga);
}
