import React from 'react';

const renderField = ({ input, id, placeholder, label, type = 'text', meta: { touched, error } }) => {
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

export default renderField;
