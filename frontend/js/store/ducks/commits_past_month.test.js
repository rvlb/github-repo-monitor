import { call, put } from 'redux-saga/effects';

import api from '../api';

import { creators, types, addRepositoryCommitsSaga } from './commits';
import '@testing-library/jest-dom/extend-expect';

test('addPastMonthCommits should create an add requested action', () => {
  const payload = { id: 1 };
  const action = creators.addPastMonthCommits(payload);
  const expectedAction = { type: types.ADD_PAST_MONTH_COMMITS_REQUESTED, payload };
  expect(action).toStrictEqual(expectedAction);
});

test('addPastMonthCommitsSuccess should create an add success action', () => {
  const payload = { data: [] };
  const action = creators.addPastMonthCommitsSuccess(payload);
  const expectedAction = { type: types.ADD_PAST_MONTH_COMMITS_SUCCESS, payload, redirectUrl: '' };
  expect(action).toStrictEqual(expectedAction);
});

test('addPastMonthCommitsError should create an add error action', () => {
  const error = { message: 'eita!' };
  const action = creators.addPastMonthCommitsError(error);
  const expectedAction = { type: types.ADD_PAST_MONTH_COMMITS_ERROR, error };
  expect(action).toStrictEqual(expectedAction);
});

const addPastMonthCommitsMockAction = { payload: { id: 1 } };
const addPastMonthCommitsServerMockResponse = { data: [] };

const addPastMonthCommitsApiCallTestCase = (generator, action) => {
  test('should make an API call to add the past month commits', () => {
    expect(JSON.stringify(generator.next().value)).toStrictEqual(
      JSON.stringify(call(api.addRepositoryPastMonthCommits, { repositoryId: action.payload.id }))
    );
  });
};

describe('addRepositoryCommitsSaga', () => {
  const triggerAction = addPastMonthCommitsMockAction;
  const gen = addRepositoryCommitsSaga(triggerAction);

  addPastMonthCommitsApiCallTestCase(gen, triggerAction);

  const mockResponse = addPastMonthCommitsServerMockResponse;
  test('should dispatch add past month commits success action', () => {
    const redirectUrl = '/commits';
    const action = creators.addPastMonthCommitsSuccess(mockResponse.data, redirectUrl);
    expect(gen.next(mockResponse).value).toStrictEqual(put(action));
  });
});

describe('addRepositoryCommitsSaga error flow', () => {
  const triggerAction = addPastMonthCommitsMockAction;
  const gen = addRepositoryCommitsSaga(triggerAction);

  addPastMonthCommitsApiCallTestCase(gen, triggerAction);

  const mockError = { response: { data: 'eita!' } };
  test('should dispatch the add past month commits error action', () => {
    const action = creators.addPastMonthCommitsError(mockError.response.data);
    expect(gen.throw(mockError).value).toStrictEqual(put(action));
  });
});
