import { call, put } from 'redux-saga/effects';

import api from '../api';

import { creators, types, fetchCommitsSaga } from './commits';
import { creators as loadingCreators } from './loading';
import '@testing-library/jest-dom/extend-expect';

// Fetch commits
test('fetchCommits should create an fetch requested action', () => {
  const payload = { repositoy: 1, offset: 10 };
  const action = creators.fetchCommits(payload);
  const expectedAction = { type: types.FETCH_REQUESTED, payload };
  expect(action).toStrictEqual(expectedAction);
});

test('fetchCommitsSuccess should create an fetch success action', () => {
  const payload = { results: [] };
  const action = creators.fetchCommitsSuccess(payload);
  const expectedAction = { type: types.FETCH_SUCCESS, payload };
  expect(action).toStrictEqual(expectedAction);
});

test('fetchCommitsError should create an fetch error action', () => {
  const error = { message: 'eita!' };
  const action = creators.fetchCommitsError(error);
  const expectedAction = { type: types.FETCH_ERROR, error };
  expect(action).toStrictEqual(expectedAction);
});

const fetchCommitsMockAction = { payload: {} };
const fetchCommitsServerMockResponse = { data: [] };

const fetchCommitsApiCallTestCase = (generator, action) => {
  test('should make an API call to fetch commits', () => {
    expect(JSON.stringify(generator.next().value)).toStrictEqual(
      JSON.stringify(call(api.fetch('commits'), action.payload))
    );
  });
};

describe('fetchCommitsSaga', () => {
  const triggerAction = fetchCommitsMockAction;
  const gen = fetchCommitsSaga(triggerAction);

  test('should dispatch the loading start action', () => {
    const action = loadingCreators.startLoading();
    expect(gen.next().value).toStrictEqual(put(action));
  });

  fetchCommitsApiCallTestCase(gen, triggerAction);

  const mockResponse = fetchCommitsServerMockResponse;
  test('should dispatch the fetch success action', () => {
    const action = creators.fetchCommitsSuccess(mockResponse.data);
    expect(gen.next(mockResponse).value).toStrictEqual(put(action));
  });

  test('should dispatch the loading finish action', () => {
    const action = loadingCreators.finishLoading();
    expect(gen.next().value).toStrictEqual(put(action));
  });
});

describe('fetchCommitsSaga error flow', () => {
  const triggerAction = fetchCommitsMockAction;
  const gen = fetchCommitsSaga(triggerAction);

  test('should dispatch the loading start action', () => {
    const action = loadingCreators.startLoading();
    expect(gen.next().value).toStrictEqual(put(action));
  });

  fetchCommitsApiCallTestCase(gen, triggerAction);

  const mockError = { response: { data: 'eita!' } };
  test('should dispatch the fetch error action', () => {
    const action = creators.fetchCommitsError(mockError.response.data);
    expect(gen.throw(mockError).value).toStrictEqual(put(action));
  });

  test('should dispatch the loading finish action', () => {
    const action = loadingCreators.finishLoading();
    expect(gen.next().value).toStrictEqual(put(action));
  });
});
