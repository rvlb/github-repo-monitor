import React from 'react';
import { Input, Label } from 'reactstrap';
import PropTypes from 'prop-types';

import Hint from '../Hint';

const renderField = ({
  input,
  wrapperClass = '',
  hint = '',
  id,
  placeholder,
  label,
  type = 'text',
  meta: { touched, error },
}) => {
  return (
    <div className={wrapperClass}>
      <div className="label-wrapper">
        <Label className="input-label" for={id}>
          {label}
        </Label>
        {hint && <Hint content={hint} inputId={id} />}
      </div>
      <Input {...input} id={id} placeholder={placeholder} type={type} />
      {touched && error && <div className="input-error">{error}</div>}
    </div>
  );
};

renderField.propTypes = {
  input: PropTypes.object,
  id: PropTypes.string,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  type: PropTypes.string,
  meta: PropTypes.shape({
    touched: PropTypes.bool,
    error: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  }),
  wrapperClass: PropTypes.string,
  hint: PropTypes.string,
};

export default renderField;
