import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

const Commit = ({ date, message, repository, url }) => {
  const dateObject = new Date(date);
  return (
    <div className="commit">
      <div className="commit-message">{message}</div>
      <div className="commit-meta">
        <div className="commit-info">
          <div className="commit-repo">
            {repository && (
              <Link to={`/commits?repository=${repository.id}`}>{repository.name}</Link>
            )}
          </div>
          <div className="commit-date">{dateObject.toLocaleString()}</div>
        </div>
        <div className="commit-url">
          <a href={url} rel="noopener noreferrer" target="_blank">
            <span className="check-on-github">ver no GitHub</span>
            <FontAwesomeIcon fixedWidth icon={faGithub} size="lg" />
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
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  url: PropTypes.string.isRequired,
};

export default Commit;
