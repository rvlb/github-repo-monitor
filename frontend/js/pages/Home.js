import React, { useState } from 'react';

import Form from '../components/RepositoryFetchForm';

const Home = () => {
  const onFormSubmit = (values) => {
    console.log(values);
  };

  return (
    <div>
      <Form onSubmit={onFormSubmit} />
    </div>
  );
};

export default Home;
