import { call, put } from 'redux-saga/effects';

import api from '../api';

import { creators, types, addRepositorySaga } from './repositories';
import { creators as commitActions } from './commits';
import '@testing-library/jest-dom/extend-expect';

const repoName = 'test-user/repo-foo';

test('addRepository should create an add requested action', () => {
  const payload = { name: repoName };
  const action = creators.addRepository(payload);
  const expectedAction = { type: types.ADD_REQUESTED, payload };
  expect(action).toStrictEqual(expectedAction);
});

test('addRepositorySuccess should create an add success action', () => {
  const repository = { name: repoName, owner: 1, id: 1 };
  const action = creators.addRepositorySuccess(repository);
  const expectedAction = { type: types.ADD_SUCCESS, repository };
  expect(action).toStrictEqual(expectedAction);
});

test('addRepositoryError should create an add error action', () => {
  const error = { message: 'eita!' };
  const action = creators.addRepositoryError(error);
  const expectedAction = { type: types.ADD_ERROR, error };
  expect(action).toStrictEqual(expectedAction);
});

test('addRepositoryAlreadyExists should create an add already exists action', () => {
  const redirectUrl = '/commits?repository=1';
  const action = creators.addRepositoryAlreadyExists(redirectUrl);
  const expectedAction = { type: types.ADD_ALREADY_EXISTS, redirectUrl };
  expect(action).toStrictEqual(expectedAction);
});

const addRepositoryMockAction = { payload: { name: 'foo-user/test-repo' } };
const addRepositoryServerMockResponse = {
  status: 201,
  data: { owner: 1, id: 1, name: 'foo-user/test-repo' },
};

const addRepositoryApiCallTestCase = (generator, action) => {
  test('should make an API call to add a repository', () => {
    expect(generator.next().value).toStrictEqual(call(api.addRepository, action.payload));
  });
};

describe('addRepositorySaga', () => {
  const triggerAction = addRepositoryMockAction;
  const gen = addRepositorySaga(triggerAction);

  addRepositoryApiCallTestCase(gen, triggerAction);

  const mockResponse = addRepositoryServerMockResponse;
  test('should dispatch a success action', () => {
    const action = creators.addRepositorySuccess(mockResponse.data);
    expect(gen.next(mockResponse).value).toStrictEqual(put(action));
  });

  test('should dispatch a request action to insert past month commits', () => {
    const action = commitActions.addPastMonthCommits(mockResponse.data);
    expect(gen.next().value).toStrictEqual(put(action));
  });
});

describe('addRepositorySaga alternative flow', () => {
  const triggerAction = addRepositoryMockAction;
  const gen = addRepositorySaga(triggerAction);

  addRepositoryApiCallTestCase(gen, triggerAction);

  const mockResponse = { ...addRepositoryServerMockResponse, status: 200 };
  test('should dispatch a repository already exists action', () => {
    const action = creators.addRepositoryAlreadyExists('/commits?repository=1');
    expect(gen.next(mockResponse).value).toStrictEqual(put(action));
  });
});

describe('addRepositorySaga error flow', () => {
  const triggerAction = addRepositoryMockAction;
  const gen = addRepositorySaga(triggerAction);

  addRepositoryApiCallTestCase(gen, triggerAction);

  const mockError = { response: { data: 'eita!' } };
  test('should dispatch a fetch error action', () => {
    const action = creators.addRepositoryError(mockError.response.data);
    expect(gen.throw(mockError).value).toStrictEqual(put(action));
  });
});
