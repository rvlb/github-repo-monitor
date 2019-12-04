import { push } from 'connected-react-router';
import { put } from 'redux-saga/effects';
import { startSubmit, stopSubmit } from 'redux-form';

import { formSubmitHandler, formSubmitSuccessHandler, formSubmitErrorHandler } from './form';
import { creators as loadingCreators } from './loading';

const formId = 'test-form';

describe('form submit requested', () => {
  const gen = formSubmitHandler(formId)();
  test('should dispatch a start submit action', () => {
    const action = startSubmit(formId);
    expect(gen.next().value).toStrictEqual(put(action));
  });
  test('should dispatch the loading start action', () => {
    const action = loadingCreators.startLoading();
    expect(gen.next().value).toStrictEqual(put(action));
  });
});

describe('form submit success without redirect', () => {
  const gen = formSubmitSuccessHandler(formId)({});
  test('should dispatch a stop submit action', () => {
    const action = stopSubmit(formId);
    expect(gen.next().value).toStrictEqual(put(action));
  });
});

describe('form submit success and then redirect', () => {
  const gen = formSubmitSuccessHandler(formId)({ redirectUrl: '/foo' });
  test('should dispatch a stop submit action', () => {
    const action = stopSubmit(formId);
    expect(gen.next().value).toStrictEqual(put(action));
  });
  test('should dispatch an action to redirect the user', () => {
    const action = push('/foo');
    expect(gen.next().value).toStrictEqual(put(action));
  });
});

describe('form submit error', () => {
  const error = { message: 'eita!' };
  const gen = formSubmitErrorHandler(formId)({ error });
  test('should dispatch the loading stop action', () => {
    const action = loadingCreators.finishLoading();
    expect(gen.next().value).toStrictEqual(put(action));
  });
  test('should dispatch a stop submit action with an error', () => {
    const action = stopSubmit(formId, error);
    expect(gen.next().value).toStrictEqual(put(action));
  });
});
