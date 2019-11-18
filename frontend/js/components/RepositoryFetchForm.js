import React from 'react';
import { Field, reduxForm } from 'redux-form';

const RepositoryFetchForm = (props) => {
  const { handleSubmit } = props;
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <Field component="input" name="repository-name" type="text" />
      </div>
      <div>
        <button type="submit">Buscar</button>
      </div>
    </form>
  );
};

export default reduxForm({ form: 'repository-fetch' })(RepositoryFetchForm);
