import { creators, types } from './repositories';
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
