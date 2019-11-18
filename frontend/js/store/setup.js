import { createStore } from 'redux';

const setup = (reducer, enhancer) => createStore(reducer, {}, enhancer);

export default setup;
