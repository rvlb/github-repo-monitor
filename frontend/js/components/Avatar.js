import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import classnames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

const Avatar = ({ className }) => {
  const user = useSelector((state) => state.user);
  return (
    <div className={classnames('avatar-wrapper', className)}>
      {Object.keys(user).length > 0 ? (
        <img alt={`Avatar de ${user.login}`} src={user.avatar} />
      ) : (
        <FontAwesomeIcon className="avatar-placeholder" icon={faGithub} />
      )}
    </div>
  );
};

Avatar.propTypes = {
  className: PropTypes.string,
};

export default Avatar;
