import { call, put, takeLatest } from 'redux-saga/effects';

import api from '../api';

import { creators as commitActions } from './commits';

// Action types
export const types = {
  ADD_REQUESTED: 'repositories/ADD_REQUESTED',
  ADD_SUCCESS: 'repositories/ADD_SUCCESS',
  ADD_ERROR: 'repositories/ADD_ERROR',
  ADD_ALREADY_EXISTS: 'repositories/ADD_ALREADY_EXISTS',
};

// Action creators
export const creators = {
  addRepository: (payload) => ({ type: types.ADD_REQUESTED, payload }),
  addRepositorySuccess: (repository) => ({ type: types.ADD_SUCCESS, repository }),
  addRepositoryError: (error) => ({ type: types.ADD_ERROR, error }),
  addRepositoryAlreadyExists: (redirectUrl) => ({
    type: types.ADD_ALREADY_EXISTS,
    redirectUrl,
  }),
};

// Sagas
export function* addRepositorySaga(action) {
  try {
    const response = yield call(api.addRepository, action.payload);
    // It only makes sense to dispatch the action if the repository was created in this request
    const repository = response.data;
    if (response.status === 201) {
      yield put(creators.addRepositorySuccess(repository));
      // After retrieving the data of the repository, dispatch the action to get the commits from that repository
      yield put(commitActions.addPastMonthCommits(repository));
    } else {
      // We will redirect the user to the commits' list page, filtered by the repository id
      const redirectUrl = `/commits?repository=${repository.id}`;
      yield put(creators.addRepositoryAlreadyExists(redirectUrl));
    }
  } catch (error) {
    yield put(creators.addRepositoryError(error.response.data));
  }
}

export function* repositoriesSaga() {
  yield takeLatest(types.ADD_REQUESTED, addRepositorySaga);
}
