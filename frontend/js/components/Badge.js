import React from 'react';
import PropTypes from 'prop-types';
import { Badge as BootstrapBadge } from 'reactstrap';

const Badge = ({ className, children }) => {
  return (
    <BootstrapBadge className={className} color="primary" pill>
      {children}
    </BootstrapBadge>
  );
};

Badge.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default Badge;
