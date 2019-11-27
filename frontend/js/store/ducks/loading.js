export const types = {
  START: 'loading/START',
  FINISH: 'loading/FINISH',
};

export const creators = {
  startLoading: () => ({ type: types.START }),
  finishLoading: () => ({ type: types.FINISH }),
};

export const loadingReducer = (state = false, action) => {
  switch (action.type) {
    case types.START:
      return true;
    case types.FINISH:
      return false;
    default:
      return state;
  }
};
