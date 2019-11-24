import React from 'react';
import PropTypes from 'prop-types';

const Commit = ({ date, message, repository, url }) => {
  const dateObject = new Date(date);
  return (
    <div className="commit">
      <div className="commit-message">{message}</div>
      <div className="commit-meta">
        <div>
          <span className="commit-repo">{repository.name}</span>
          <span className="commit-date">{dateObject.toLocaleString()}</span>
        </div>
        <div className="commit-url">
          <a href={url} rel="noopener noreferrer" target="_blank">
            ver no GitHub
          </a>
        </div>
      </div>
    </div>
  );
};

Commit.propTypes = {
  date: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  repository: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }),
  url: PropTypes.string.isRequired,
};

export default Commit;
