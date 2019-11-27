import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Form, Button, Row, Col } from 'reactstrap';
import PropTypes from 'prop-types';

import renderField from './renderField';

const validate = ({ name }) => {
  const errors = {};
  if (!name) {
    errors.name = 'Campo obrigatório.';
  } else {
    const repositoryData = name.split('/').filter((v) => v.length > 0);
    if (repositoryData.length !== 2) {
      errors.name = 'Nome de repositório mal formado.';
    }
  }
  return errors;
};

const RepositoryAddForm = ({ handleSubmit, error, submitting }) => {
  return (
    <>
      <Form className="repository-add-form" onSubmit={handleSubmit}>
        <Row className="justify-content-center">
          <Col lg="5" md="6" sm="8" xs="12">
            <Field
              component={renderField}
              hint="O nome do repositório deve ser escrito como [nome do usuário]/[nome do projeto]."
              id="name"
              label="Nome do repositório"
              name="name"
              wrapperClass="input-wrapper"
            />
          </Col>
          <Col lg="2" md="3" sm="4" xs="5">
            <div className="input-wrapper">
              <Button block color="success" disabled={submitting} type="submit">
                Monitorar
              </Button>
            </div>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col lg="7" md="9" xs="12">
            <div className="form-errors">{error}</div>
          </Col>
        </Row>
      </Form>
    </>
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
