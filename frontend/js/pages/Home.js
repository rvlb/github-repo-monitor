import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Form from '../components/forms/RepositoryAddForm';
import { repositoryAdd } from '../actions';

const Home = ({ repositoryAdd }) => {
  const onSubmit = ({ repositoryName }) => {
    const name = repositoryName;
    // Cria a action para fazer a requisição ao backend
    repositoryAdd({ name });
  };
  return (
    <div>
      <Form onSubmit={onSubmit} />
    </div>
  );
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ repositoryAdd }, dispatch);
};

export default connect(
  null,
  mapDispatchToProps
)(Home);
