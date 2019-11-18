export const actionTypes = {
  REPOSITORY_FETCH_SUCCESS: 'REPOSITORY_FETCH_SUCCESS',
  REPOSITORY_FETCH_ERROR: 'REPOSITORY_FETCH_ERROR',
};

export const repositoryFetch = (data) => {
  return (dispatch, getState, { api }) => {
    return api
      .repositoryFetch(data)
      .then((response) => {
        return dispatch({
          type: actionTypes.REPOSITORY_FETCH_SUCCESS,
          payload: response,
        });
      })
      .catch((error) => {
        return dispatch({
          type: actionTypes.REPOSITORY_FETCH_ERROR,
          error,
        });
      });
  };
};
