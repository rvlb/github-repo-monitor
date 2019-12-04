import { creators, types } from './loading';
import '@testing-library/jest-dom/extend-expect';

test('startLoading should create a start action', () => {
  const expectedAction = { type: types.START };
  expect(creators.startLoading()).toStrictEqual(expectedAction);
});

test('finishLoading should create a finish action', () => {
  const expectedAction = { type: types.FINISH };
  expect(creators.finishLoading()).toStrictEqual(expectedAction);
});
