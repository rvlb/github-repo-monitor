import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Form from '../components/forms/RepositoryFetchForm';
import { repositoryFetch } from '../actions';

const Home = ({ repositoryFetch }) => {
  const onSubmit = ({ repositoryName }) => {
    const name = repositoryName;
    // Cria a action para fazer a requisição ao backend
    repositoryFetch({ name });
  };
  return (
    <div>
      <Form onSubmit={onSubmit} />
    </div>
  );
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ repositoryFetch }, dispatch);
};

export default connect(
  null,
  mapDispatchToProps
)(Home);
