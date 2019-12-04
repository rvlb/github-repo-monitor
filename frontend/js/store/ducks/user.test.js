import { call, put } from 'redux-saga/effects';

import api from '../api';

import { creators, types, fetchUserSaga } from './user';
import '@testing-library/jest-dom/extend-expect';

test('fetchUser should create a fetch requested action', () => {
  const expectedAction = { type: types.FETCH_REQUESTED };
  expect(creators.fetchUser()).toStrictEqual(expectedAction);
});

test('fetchUserSuccess should create a fetch success action', () => {
  const userData = { login: 'test-user' };
  const expectedAction = { type: types.FETCH_SUCCESS, payload: userData };
  expect(creators.fetchUserSuccess(userData)).toStrictEqual(expectedAction);
});

test('fetchUserError should create a fetch error action', () => {
  const error = { message: 'oops...' };
  const expectedAction = { type: types.FETCH_ERROR, error };
  expect(creators.fetchUserError(error)).toStrictEqual(expectedAction);
});

test('fetchUserSaga should make an API call and dispatch a fetch success action', () => {
  const gen = fetchUserSaga();
  expect(JSON.stringify(gen.next().value)).toStrictEqual(
    JSON.stringify(call(api.fetch('github-data')))
  );
  const mockResponse = { data: { login: 'test-user' } };
  expect(gen.next(mockResponse).value).toStrictEqual(
    put(creators.fetchUserSuccess(mockResponse.data))
  );
});

test('fetchUserSaga should make an API call and dispatch a fetch error action if something wrong happens', () => {
  const gen = fetchUserSaga();
  expect(JSON.stringify(gen.next().value)).toStrictEqual(
    JSON.stringify(call(api.fetch('github-data')))
  );
  const mockError = { response: { data: 'eita!' } };
  expect(gen.throw(mockError).value).toStrictEqual(
    put(creators.fetchUserError(mockError.response.data))
  );
});
