import React from 'react';
import '@testing-library/jest-dom/extend-expect';

import { renderWithRedux } from '../utils/testing';

import LoadingWrapper from './LoadingWrapper';

test('renders the loading overlay when loading=true in the store', () => {
  renderWithRedux(<LoadingWrapper />, {
    state: { loading: true },
  });
  expect(document.querySelector('.loading-overlay')).toBeInTheDocument();
});

test('do not render the loading overlay when loading=false in the store', () => {
  renderWithRedux(<LoadingWrapper />, {
    state: { loading: false },
  });
  expect(document.querySelector('.loading-overlay')).not.toBeInTheDocument();
});
