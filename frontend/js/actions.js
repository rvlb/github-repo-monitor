export const actionTypes = {
  REPOSITORY_ADD_SUCCESS: 'REPOSITORY_ADD_SUCCESS',
  REPOSITORY_ADD_ERROR: 'REPOSITORY_ADD_ERROR',
};

export const repositoryAdd = (data) => {
  return (dispatch, getState, { api }) => {
    return api
      .repositoryAdd(data)
      .then((response) => {
        return dispatch({
          type: actionTypes.REPOSITORY_ADD_SUCCESS,
          payload: response,
        });
      })
      .catch((error) => {
        return dispatch({
          type: actionTypes.REPOSITORY_ADD_ERROR,
          error,
        });
      });
  };
};
