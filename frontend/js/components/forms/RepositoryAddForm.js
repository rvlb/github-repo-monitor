import React from 'react';
import { Field, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';

import renderField from './renderField';

const validate = ({ name }) => {
  const errors = {};
  if (!name) {
    errors.name = 'Campo obrigatório';
  } else {
    const repositoryData = name.split('/').filter((v) => v.length > 0);
    if (repositoryData.length !== 2) {
      errors.name = 'Nome de repositório mal formado';
    }
  }
  return errors;
};

const RepositoryAddForm = ({ handleSubmit, error, submitting }) => {
  return (
    <form onSubmit={handleSubmit}>
      <Field
        component={renderField}
        id="name"
        label="Nome do repositório"
        name="name"
        placeholder="{usuario}/{repositorio}"
      />
      {error && <strong>{error}</strong>}
      <div>
        <button disabled={submitting} type="submit">
          Buscar
        </button>
      </div>
    </form>
  );
};

RepositoryAddForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
};

export default reduxForm({
  form: 'repository-add',
  validate,
  submitAsSideEffect: true,
})(RepositoryAddForm);
