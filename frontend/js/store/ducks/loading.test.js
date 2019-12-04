import { creators, types } from './loading';
import '@testing-library/jest-dom/extend-expect';

test('startLoading should create a start action', () => {
  const expectedAction = { type: types.START };
  const action = creators.startLoading();
  expect(action).toStrictEqual(expectedAction);
});

test('finishLoading should create a finish action', () => {
  const expectedAction = { type: types.FINISH };
  const action = creators.finishLoading();
  expect(action).toStrictEqual(expectedAction);
});
