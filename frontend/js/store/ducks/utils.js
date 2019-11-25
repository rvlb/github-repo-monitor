import { put, takeLatest } from 'redux-saga/effects';
import { startSubmit, stopSubmit } from 'redux-form';

import { types as repositoryTypes } from './repositories';
import { types as commitTypes } from './commits';

export function formSubmitHandler(formId) {
  return function* formSubmitSaga() {
    yield put(startSubmit(formId));
  };
}

export function formSubmitSuccessHandler(formId) {
  return function* formSubmitSuccessSaga() {
    yield put(stopSubmit(formId));
  };
}

export function formSubmitErrorHandler(formId) {
  return function* formSubmitErrorSaga(action) {
    yield put(stopSubmit(formId, action.error));
  };
}

/**
 * In order to use sagas with redux-form, we must manually handle its submission steps.
 * 1) The submission of 'repository-add' begins when we request to add a repository (repositoryTypes.ADD_REQUESTED)
 * 2) It ends when all the past month commits are succesfully added (commitTypes.ADD_PAST_MONTH_COMMITS_SUCCESS)
 * 3) It can also end in an error flow if the repository can't be added (repositoryTypes.ADD_ERROR) or if something
 * wrong happens when we add the past month commits (commitTypes.ADD_PAST_MONTH_COMMITS_ERROR), although the latter
 * is less common.
 */
export function* formSaga() {
  const formId = 'repository-add';
  yield takeLatest(repositoryTypes.ADD_REQUESTED, formSubmitHandler(formId));
  yield takeLatest(commitTypes.ADD_PAST_MONTH_COMMITS_SUCCESS, formSubmitSuccessHandler(formId));
  yield takeLatest(repositoryTypes.ADD_ERROR, formSubmitErrorHandler(formId));
  yield takeLatest(commitTypes.ADD_PAST_MONTH_COMMITS_ERROR, formSubmitErrorHandler(formId));
}

// TODO: show a loading icon for all network requests
