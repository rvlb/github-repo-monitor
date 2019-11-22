import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Form from '../components/forms/RepositoryAddForm';
import { creators } from '../store/ducks/repositories';

const Home = ({ addRepository }) => {
  const onSubmit = ({ repositoryName }) => {
    const name = repositoryName;
    // Cria a action para fazer a requisição ao backend
    addRepository({ name });
  };
  return (
    <div>
      <Form onSubmit={onSubmit} />
    </div>
  );
};

const mapDispatchToProps = (dispatch) => bindActionCreators(creators, dispatch);

export default connect(
  null,
  mapDispatchToProps
)(Home);
