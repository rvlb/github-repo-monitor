import React from 'react';
import { useSelector } from 'react-redux';
import { sortBy } from 'lodash';

import Commit from '../components/Commit';

const CommitsList = () => {
  const commits = useSelector((state) => state.commits);
  const repositories = useSelector((state) => state.repositories);
  return (
    <div className="commits-list">
      {sortBy(commits, ['date']).map(({ code, message, repository: repositoryId, url, date }) => {
        const repository = repositories.find((repository) => repository.id === repositoryId);
        return (
          <div key={`commit-${code}`}>
            <Commit date={date} message={message} repository={repository} url={url} />
          </div>
        );
      })}
    </div>
  );
};

export default CommitsList;
