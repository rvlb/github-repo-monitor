import { call, put, takeLatest } from 'redux-saga/effects';

// Action types
export const types = {
  ADD_REQUESTED: 'commits/ADD_REQUESTED',
  ADD_SUCCESS: 'commits/ADD_SUCCESS',
  ADD_ERROR: 'commits/ADD_ERROR',
  LIST_REQUESTED: 'commits/ADD_REQUESTED',
  LIST_SUCCESS: 'commits/LIST_SUCCESS',
  LIST_ERROR: 'commits/LIST_ERROR',
};

// Sagas
function* addCommitsSaga(action) {
  // TODO: implement this saga
  console.log(action);
}

export function* commitsSaga() {
  yield takeLatest(types.ADD_REQUESTED, addCommitsSaga);
}
