import { call, put, takeLatest } from 'redux-saga/effects';

import api from '../api';

import { types as commitTypes } from './commits';

// Action types
export const types = {
  ADD_REQUESTED: 'repositories/ADD_REQUESTED',
  ADD_SUCCESS: 'repositories/ADD_SUCCESS',
  ADD_ERROR: 'repositories/ADD_ERROR',
};

// Action creators
export const creators = {
  addRepository: (payload) => ({ type: types.ADD_REQUESTED, payload }),
};

// Reducer
export const repositoriesReducer = (state = [], action) => {
  if (action.type === types.ADD_SUCCESS) {
    return [...state, action.payload];
  }
  return state;
};

// Sagas
function* addRepositorySaga(action) {
  try {
    const response = yield call(api.addRepository, action.payload);
    // It only makes sense to dispatch the action if the repository was created in this request
    const repository = response.data;
    if (response.status === 201) {
      yield put({ type: types.ADD_SUCCESS, payload: response.data });
    }
    // After retrieving the data of the repository, dispatch the event to get the commits from that repository
    yield put({ type: commitTypes.ADD_REQUESTED, payload: repository });
  } catch (error) {
    yield put({ type: types.ADD_ERROR, error });
  }
}

export function* repositoriesSaga() {
  yield takeLatest(types.ADD_REQUESTED, addRepositorySaga);
}
