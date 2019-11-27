import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { UncontrolledTooltip } from 'reactstrap';
import PropTypes from 'prop-types';

const Hint = ({ inputId, content }) => {
  const target = `hint-${inputId}`;
  return (
    <span className="hint-wrapper">
      <FontAwesomeIcon fixedWidth icon={faQuestionCircle} id={target} />
      <UncontrolledTooltip placement="bottom" target={target}>
        {content}
      </UncontrolledTooltip>
    </span>
  );
};

Hint.propTypes = {
  content: PropTypes.string.isRequired,
  inputId: PropTypes.string.isRequired,
};

export default Hint;
