import React from 'react';

const Commit = ({ id, title, repository }) => {
  return (
    <div className="commit">
      <div className="commit-title">{title}</div>
      <div className="commit-id">{id}</div>
      <div className="commit-repository">{repository}</div>
    </div>
  );
};

export default Commit;
