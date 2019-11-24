import { call, fork, put, takeLatest } from 'redux-saga/effects';
import { push } from 'connected-react-router';

import api from '../api';

// Action types
export const types = {
  ADD_PAST_MONTH_COMMITS_REQUESTED: 'commits/ADD_PAST_MONTH_COMMITS_REQUESTED',
  ADD_PAST_MONTH_COMMITS_SUCCESS: 'commits/ADD_PAST_MONTH_COMMITS_SUCCESS',
  ADD_PAST_MONTH_COMMITS_ERROR: 'commits/ADD_PAST_MONTH_COMMITS_ERROR',

  FETCH_ALL_REQUESTED: 'commits/FETCH_REQUESTED',
  FETCH_ALL_SUCCESS: 'commits/FETCH_SUCCESS',
  FETCH_ALL_ERROR: 'commits/FETCH_ERROR',
};

// Action creators
export const creators = {
  addPastMonthCommits: (payload) => ({ type: types.ADD_PAST_MONTH_COMMITS_REQUESTED, payload }),
  addPastMonthCommitsSuccess: (payload) => {
    return { type: types.ADD_PAST_MONTH_COMMITS_SUCCESS, payload };
  },
  addPastMonthCommitsError: (error) => ({ type: types.ADD_PAST_MONTH_COMMITS_ERROR, error }),

  fetchCommits: (payload) => ({ type: types.FETCH_ALL_REQUESTED, payload }),
  fetchCommitsSuccess: (payload) => ({ type: types.FETCH_ALL_SUCCESS, payload }),
  fetchCommitsError: (error) => ({ type: types.FETCH_ALL_ERROR, error }),
};

// Reducer
export const commitsReducer = (state = [], action) => {
  switch (action.type) {
    case types.FETCH_ALL_SUCCESS:
      return [...action.payload];
    case types.ADD_PAST_MONTH_COMMITS_SUCCESS:
      return [...state, ...action.payload];
    default:
      return state;
  }
};

// Sagas
export function* fetchCommitsSaga() {
  try {
    const response = yield call(api.fetchAll('commits'));
    yield put(creators.fetchCommitsSuccess(response.data));
  } catch (error) {
    yield put(creators.fetchCommitsError(error));
  }
}

export function* addRepositoryCommitsSaga(action) {
  try {
    const repository = action.payload;
    const response = yield call(api.addRepositoryPastMonthCommits, { repositoryId: repository.id });
    // It only makes sense to dispatch the action if the commits were created in this request
    if (response.status === 201) {
      yield put(creators.addPastMonthCommitsSuccess(response.data));
    }
    yield put(push('/commits'));
  } catch (error) {
    yield put(creators.addPastMonthCommitsError(error));
  }
}

export function* commitsSaga() {
  yield takeLatest(types.FETCH_ALL_REQUESTED, fetchCommitsSaga);
  yield takeLatest(types.ADD_PAST_MONTH_COMMITS_REQUESTED, addRepositoryCommitsSaga);

  yield fork(fetchCommitsSaga);
}
