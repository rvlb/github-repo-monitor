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

const RepositoryAddForm = ({ handleSubmit }) => {
  return (
    <form onSubmit={handleSubmit}>
      <Field
        component={renderField}
        id="name"
        label="Nome do repositório"
        name="name"
        placeholder="{usuario}/{repositorio}"
      />
      <div>
        <button type="submit">Buscar</button>
      </div>
    </form>
  );
};

RepositoryAddForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

export default reduxForm({ form: 'repository-add', validate })(RepositoryAddForm);
