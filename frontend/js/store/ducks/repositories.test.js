import { call, put } from 'redux-saga/effects';

import api from '../api';

import { creators, types, addRepositorySaga } from './repositories';
import { creators as commitActions } from './commits';
import '@testing-library/jest-dom/extend-expect';

const repoName = 'test-user/repo-foo';

test('addRepository should create an add requested action', () => {
  const payload = { name: repoName };
  const expectedAction = { type: types.ADD_REQUESTED, payload };
  expect(creators.addRepository(payload)).toStrictEqual(expectedAction);
});

test('addRepositorySuccess should create an add success action', () => {
  const repository = { name: repoName, owner: 1, id: 1 };
  const expectedAction = { type: types.ADD_SUCCESS, repository };
  expect(creators.addRepositorySuccess(repository)).toStrictEqual(expectedAction);
});

test('addRepositoryError should create an add error action', () => {
  const error = { message: 'eita!' };
  const expectedAction = { type: types.ADD_ERROR, error };
  expect(creators.addRepositoryError(error)).toStrictEqual(expectedAction);
});

test('addRepositoryAlreadyExists should create an add already exists action', () => {
  const repository = { name: repoName, owner: 1, id: 1 };
  const expectedAction = { type: types.ADD_ALREADY_EXISTS, repository };
  expect(creators.addRepositoryAlreadyExists(repository)).toStrictEqual(expectedAction);
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
  const action = addRepositoryMockAction;
  const gen = addRepositorySaga(action);

  addRepositoryApiCallTestCase(gen, action);

  const mockResponse = addRepositoryServerMockResponse;
  test('should dispatch a success action', () => {
    expect(gen.next(mockResponse).value).toStrictEqual(
      put(creators.addRepositorySuccess(mockResponse.data))
    );
  });

  test('should dispatch a request action to insert past month commits', () => {
    expect(gen.next().value).toStrictEqual(
      put(commitActions.addPastMonthCommits(mockResponse.data))
    );
  });
});

describe('addRepositorySaga alternative flow', () => {
  const action = addRepositoryMockAction;
  const gen = addRepositorySaga(addRepositoryMockAction);

  addRepositoryApiCallTestCase(gen, action);

  const mockResponse = { ...addRepositoryServerMockResponse, status: 200 };
  test('should dispatch a repository already exists action', () => {
    expect(gen.next(mockResponse).value).toStrictEqual(
      put(creators.addRepositoryAlreadyExists(mockResponse.data))
    );
  });
});

describe('addRepositorySaga error flow', () => {
  const action = addRepositoryMockAction;
  const gen = addRepositorySaga(addRepositoryMockAction);

  addRepositoryApiCallTestCase(gen, action);

  const mockError = { response: { data: 'eita!' } };
  test('should dispatch a fetch error action', () => {
    expect(gen.throw(mockError).value).toStrictEqual(
      put(creators.addRepositoryError(mockError.response.data))
    );
  });
});
