import React from 'react';
import '@testing-library/jest-dom/extend-expect';

import { renderWithRedux } from '../utils/testing';

import Avatar from './Avatar';

test('renders the avatar placeholder if there is no user data in the store', () => {
  renderWithRedux(<Avatar />, {
    state: { user: {} },
  });
  expect(document.querySelector('.avatar-placeholder')).toBeInTheDocument();
});

test('renders the avatar with the GitHub image when there is user data in the store', () => {
  renderWithRedux(<Avatar />, {
    state: { user: { login: 'test-user' } },
  });
  expect(document.querySelector('img[alt="Avatar de test-user"]')).toBeInTheDocument();
});
