import { call, put, takeLatest } from 'redux-saga/effects';

import api from '../api';

// Action types
export const types = {
  FETCH_REQUESTED: 'user/FETCH_REQUESTED',
  FETCH_SUCCESS: 'user/FETCH_SUCCESS',
  FETCH_ERROR: 'user/FETCH_ERROR',
};

// Action creators
export const creators = {
  fetchUser: () => ({ type: types.FETCH_REQUESTED }),
  fetchUserSuccess: (payload) => ({ type: types.FETCH_SUCCESS, payload }),
  fetchUserError: (error) => ({ type: types.FETCH_ERROR, error }),
};

// Reducer
export const userReducer = (state = {}, action) => {
  if (action.type === types.FETCH_SUCCESS) return action.payload;
  return state;
};

// Sagas
export function* fetchUserSaga(action) {
  try {
    const response = yield call(api.fetch('github-data'), action.payload);
    yield put(creators.fetchUserSuccess(response.data));
  } catch (error) {
    yield put(creators.fetchUserError(error.response.data));
  }
}

export function* userSaga() {
  yield takeLatest(types.FETCH_REQUESTED, fetchUserSaga);
}
