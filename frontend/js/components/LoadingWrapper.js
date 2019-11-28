import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import Spinner from './LoadingSpinner';

const LoadingWrapper = ({ children }) => {
  const isLoading = useSelector((state) => state.loading);
  return (
    <div className="loading-wrapper">
      {isLoading && (
        <div className="loading-overlay">
          <Spinner className="loading-spinner" />
        </div>
      )}
      {children}
    </div>
  );
};

LoadingWrapper.propTypes = {
  children: PropTypes.node,
};

export default LoadingWrapper;
