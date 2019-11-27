import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const LoadingSpinner = ({ className }) => {
  return (
    <div className={className}>
      <FontAwesomeIcon icon={faSpinner} pulse size="5x" />
    </div>
  );
};

LoadingSpinner.propTypes = {
  className: PropTypes.string,
};

export default LoadingSpinner;
