import React from 'react';
import { MemoryRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';

import { renderWithRedux } from '../utils/testing';

import CommitsListView from './CommitsListView';

test('test paginator should render if commit state has a previous/next link', () => {
  const { getByText } = renderWithRedux(
    <Router>
      <CommitsListView />
    </Router>,
    {
      state: {
        commits: {
          previous: 'https://foo.com/previous',
          next: 'https://foo.com/next',
          results: [],
        },
      },
    }
  );

  expect(getByText('Página 1')).toBeInTheDocument();
  // Current page number, previous page and next page
  expect(document.querySelectorAll('button.page-link')).toHaveLength(3);
});

test('test filter badge should render when query param is in url', () => {
  const { getByText } = renderWithRedux(
    <Router initialEntries={['/commits?repository=1']}>
      <CommitsListView />
    </Router>,
    {
      state: {
        commits: {
          previous: false,
          next: false,
          results: [
            {
              date: '2019-02-10',
              message: 'Hello World',
              url: 'https://foo.bar/commit',
              repository: {
                id: 1,
                owner: 1,
                name: 'test-user/foo-repo',
              },
            },
          ],
        },
      },
    }
  );

  expect(getByText('Exibindo commits de test-user/foo-repo')).toBeInTheDocument();
});
