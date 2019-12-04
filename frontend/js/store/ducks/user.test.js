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

const fetchGitHubDataApiCallTestCase = (generator) => {
  test('should make an API call', () => {
    expect(JSON.stringify(generator.next().value)).toStrictEqual(
      JSON.stringify(call(api.fetch('github-data')))
    );
  });
};

describe('fetchUserSaga', () => {
  const gen = fetchUserSaga();
  fetchGitHubDataApiCallTestCase(gen);
  const mockResponse = { data: { login: 'test-user' } };
  test('should dispatch a fetch success action', () => {
    expect(gen.next(mockResponse).value).toStrictEqual(
      put(creators.fetchUserSuccess(mockResponse.data))
    );
  });
});

describe('fetchUserSaga error flow', () => {
  const gen = fetchUserSaga();
  fetchGitHubDataApiCallTestCase(gen);
  const mockError = { response: { data: 'eita!' } };
  test('should dispatch a fetch error action', () => {
    expect(gen.throw(mockError).value).toStrictEqual(
      put(creators.fetchUserError(mockError.response.data))
    );
  });
});
