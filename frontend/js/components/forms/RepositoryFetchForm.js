import React from 'react';
import { Field, reduxForm, SubmissionError } from 'redux-form';

import renderField from './renderField';

const validate = ({ repositoryName }) => {
  const errors = {};
  if (!repositoryName) {
    errors.repositoryName = 'Campo obrigatório';
  } else {
    const repositoryData = repositoryName.split('/').filter((v) => v.length > 0);
    if (repositoryData.length !== 2) {
      errors.repositoryName = 'Nome de repositório mal formado';
    }
  }
  return errors;
};

const RepositoryFetchForm = ({ handleSubmit }) => {
  return (
    <form onSubmit={handleSubmit}>
      <Field
        component={renderField}
        id="repositoryName"
        label="Nome do repositório"
        name="repositoryName"
        placeholder="{usuario}/{repositorio}"
      />
      <div>
        <button type="submit">Buscar</button>
      </div>
    </form>
  );
};

export default reduxForm({ form: 'repository-fetch', validate })(RepositoryFetchForm);
