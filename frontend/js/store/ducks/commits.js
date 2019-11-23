import { call, put, takeLatest } from 'redux-saga/effects';

import api from '../api';

// Action types
export const types = {
  ADD_REQUESTED: 'commits/ADD_REQUESTED',
  ADD_SUCCESS: 'commits/ADD_SUCCESS',
  ADD_ERROR: 'commits/ADD_ERROR',
  LIST_REQUESTED: 'commits/ADD_REQUESTED',
  LIST_SUCCESS: 'commits/LIST_SUCCESS',
  LIST_ERROR: 'commits/LIST_ERROR',
  ADD_PAST_MONTH_COMMITS_REQUESTED: 'commits/ADD_PAST_MONTH_COMMITS_REQUESTED',
  ADD_PAST_MONTH_COMMITS_SUCCESS: 'commits/ADD_PAST_MONTH_COMMITS_SUCCESS',
  ADD_PAST_MONTH_COMMITS_ERROR: 'commits/ADD_PAST_MONTH_COMMITS_ERROR',
};

// Action creators
export const creators = {
  addPastMonthCommits: (payload) => ({ type: types.ADD_PAST_MONTH_COMMITS_REQUESTED, payload }),
  addPastMonthCommitsSuccess: (payload) => {
    return { type: types.ADD_PAST_MONTH_COMMITS_SUCCESS, payload };
  },
  addPastMonthCommitsError: (error) => ({ type: types.ADD_PAST_MONTH_COMMITS_ERROR, error }),
};

// Reducer
export const commitsReducer = (state = [], action) => {
  if (action.type === types.ADD_PAST_MONTH_COMMITS_SUCCESS) {
    const newCommits = action.payload;
    return [...state, ...newCommits];
  }
  return state;
};

// Sagas
function* addRepositoryCommitsSaga(action) {
  try {
    const repository = action.payload;
    const response = yield call(api.addRepositoryPastMonthCommits, { repositoryId: repository.id });
    // It only makes sense to dispatch the action if the commits were created in this request
    if (response.status === 201) {
      yield put(creators.addPastMonthCommitsSuccess(response.data));
    }
  } catch (error) {
    yield put(creators.addPastMonthCommitsError(error));
  }
}

export function* commitsSaga() {
  yield takeLatest(types.ADD_PAST_MONTH_COMMITS_REQUESTED, addRepositoryCommitsSaga);
}
