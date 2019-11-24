import React from 'react';
import PropTypes from 'prop-types';

const renderField = ({
  input,
  id,
  placeholder,
  label,
  type = 'text',
  meta: { touched, error },
}) => {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <div>
        <input {...input} id={id} placeholder={placeholder} type={type} />
        {touched && error && <span>{error}</span>}
      </div>
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
    error: PropTypes.string,
  }),
};

export default renderField;
