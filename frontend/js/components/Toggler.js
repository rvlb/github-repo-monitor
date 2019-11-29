import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';

const Toggler = ({ children, className, onClick, isOpen = false }) => {
  const caretIcon = isOpen ? faCaretUp : faCaretDown;
  return (
    <button className={classnames('toggler', className)} type="button" onClick={onClick}>
      {children}
      <FontAwesomeIcon fixedWidth icon={caretIcon} />
    </button>
  );
};

Toggler.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  isOpen: PropTypes.bool,
};

export default Toggler;
