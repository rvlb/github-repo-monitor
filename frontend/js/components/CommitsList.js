import React from 'react';
import PropTypes from 'prop-types';

import Commit from './Commit';

const CommitsList = ({ commits = [] }) => {
  return (
    <div className="commits-list">
      {commits.map(({ code, message, repository, url, date }) => {
        return (
          <div key={`commit-${code}`}>
            <Commit date={date} message={message} repository={repository} url={url} />
          </div>
        );
      })}
      {commits.length === 0 && (
        <div className="no-commits-message">
          Ops, parece que este repositório ainda não tem commits capturados...
        </div>
      )}
    </div>
  );
};

CommitsList.propTypes = {
  commits: PropTypes.arrayOf(Commit),
};

export default CommitsList;
