import React from 'react';
import { useDispatch } from 'react-redux';

import RepositoryAddForm from '../components/forms/RepositoryAddForm';
import { creators } from '../store/ducks/repositories';

const HomeView = () => {
  const dispatch = useDispatch();
  // Method that will handle the form submission after the validations are done
  const onSubmit = ({ name }) => {
    // Create the action object and then dispatch it
    const action = creators.addRepository({ name });
    dispatch(action);
  };
  return (
    <div>
      <RepositoryAddForm onSubmit={onSubmit} />
    </div>
  );
};

export default HomeView;
