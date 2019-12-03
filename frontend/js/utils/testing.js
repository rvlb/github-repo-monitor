import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';

import { history } from '../store';
import { createRootReducer } from '../store/ducks';

const reducer = createRootReducer(history);
export const renderWithRedux = (ui, { state, store = createStore(reducer, state) } = {}) => {
  return {
    ...render(<Provider store={store}>{ui}</Provider>),
    store,
  };
};
