import React from 'react';
import { fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { renderWithRedux } from '../utils/testing';

import HomeView from './HomeView';

const changeInputValue = (element, value) => {
  fireEvent.change(element, { target: { value } });
};

const submitForm = (element) => {
  fireEvent.submit(element);
};

test('test HomeView behaviour without value in input', () => {
  const { getByText } = renderWithRedux(<HomeView />);
  const form = document.querySelector('.repository-add-form');
  submitForm(form);
  expect(getByText('Campo obrigatório.')).toBeInTheDocument();
});

test('test HomeView behaviour with bad formatted input', () => {
  const { getByText } = renderWithRedux(<HomeView />);
  const form = document.querySelector('.repository-add-form');
  const nameInput = document.querySelector('.repository-add-form input[name=name]');

  const errorMessage = 'Nome de repositório mal formado.';

  changeInputValue(nameInput, 'test/');
  submitForm(form);
  expect(getByText(errorMessage)).toBeInTheDocument();

  changeInputValue(nameInput, '/hello');
  submitForm(form);
  expect(getByText(errorMessage)).toBeInTheDocument();

  changeInputValue(nameInput, '/');
  submitForm(form);
  expect(getByText(errorMessage)).toBeInTheDocument();

  changeInputValue(nameInput, 'test');
  submitForm(form);
  expect(getByText(errorMessage)).toBeInTheDocument();
});
