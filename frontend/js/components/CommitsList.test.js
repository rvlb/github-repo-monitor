import React from 'react';
import { MemoryRouter as Router } from 'react-router-dom';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import CommitsList from './CommitsList';

test('renders a message if there is no commit to show', () => {
  render(
    <Router>
      <CommitsList />
    </Router>
  );
  expect(document.querySelector('.no-commits-message')).toBeInTheDocument();
});

test('renders the commits list and do not show the message if there are commits to show', () => {
  const commits = [
    {
      code: '9353580',
      date: '2019-02-10',
      message: 'Let It Be',
      repository: {
        id: 1,
        name: 'test-user/test-repo',
      },
      url: 'https://foo-git.com/test-user/test-repo/9353580',
    },
    {
      code: '6389793',
      date: '2018-12-24',
      message: 'Hey Jude',
      repository: {
        id: 1,
        name: 'test-user/test-repo',
      },
      url: 'https://foo-git.com/test-user/test-repo/6389793',
    },
    {
      code: '467948024',
      date: '2018-12-24',
      message: 'Dear Prudence',
      repository: {
        id: 2,
        name: 'test-user/foo-repo',
      },
      url: 'https://foo-git.com/test-user/foo-repo/467948024',
    },
  ];
  render(
    <Router>
      <CommitsList commits={commits} />
    </Router>
  );
  expect(document.querySelectorAll('.commit').length).toStrictEqual(3);
  expect(document.querySelector('.no-commits-message')).not.toBeInTheDocument();
});
