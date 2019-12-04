import { push } from 'connected-react-router';
import { put, takeLatest } from 'redux-saga/effects';
import { startSubmit, stopSubmit } from 'redux-form';

import { types as repositoryTypes } from './repositories';
import { types as commitTypes } from './commits';
import { creators as loadingCreators } from './loading';

export function formSubmitHandler(formId) {
  return function* formSubmitSaga() {
    yield put(startSubmit(formId));
    yield put(loadingCreators.startLoading());
  };
}

export function formSubmitSuccessHandler(formId) {
  return function* formSubmitSuccessSaga({ redirectUrl }) {
    // In our context, we can delegate the responsibility of stopping the loading spinner
    // when the form successfully submits to the "fetch commits" flow, just to avoid hiding
    // the spinner and some frames later showing it again
    yield put(stopSubmit(formId));
    // If we passed a redirectUrl as a value in the action object, then redirect the user
    if (redirectUrl) yield put(push(redirectUrl));
  };
}

export function formSubmitErrorHandler(formId) {
  return function* formSubmitErrorSaga(action) {
    // If the form submit fails, we don't redirect the user to the commits page, so the form
    // becomes responsible of stopping the spinner (see formSubmitSuccessHandler for context)
    yield put(loadingCreators.finishLoading());
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
  yield takeLatest(repositoryTypes.ADD_ALREADY_EXISTS, formSubmitSuccessHandler(formId));
  yield takeLatest(commitTypes.ADD_PAST_MONTH_COMMITS_SUCCESS, formSubmitSuccessHandler(formId));
  yield takeLatest(repositoryTypes.ADD_ERROR, formSubmitErrorHandler(formId));
  yield takeLatest(commitTypes.ADD_PAST_MONTH_COMMITS_ERROR, formSubmitErrorHandler(formId));
}
