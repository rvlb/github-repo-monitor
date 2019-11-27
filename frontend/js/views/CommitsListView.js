import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { creators } from '../store/ducks/commits';
import CommitsList from '../components/CommitsList';
import Paginator from '../components/Paginator';

const CommitsListView = () => {
  const dispatch = useDispatch();
  const [paginator, setPaginator] = useState(0);
  // Checks if there is any query parameter in the URL
  const { search } = useLocation();
  // When query params change, reset the paginator to zero
  useEffect(() => {
    setPaginator(0);
  }, [search]);
  // Effect to fetch commits in the backend (only when the query param or the page change)
  useEffect(() => {
    // Build an object holding the query-string/search params data,
    // so we can filter the commits by repositories in the server
    const qs = Object.fromEntries(new URLSearchParams(search));
    // Dispatch an action to fetch the next 10 commits to display in the list.
    const action = creators.fetchCommits({ offset: paginator * 10, ...qs });
    dispatch(action);
  }, [paginator, search]);
  // Access the store and get the new commits' list
  const commits = useSelector((state) => state.commits);
  // Auxiliar renderer for the paginator, renders only if the current page has a previous/next page
  const renderPaginator = () =>
    (commits.previous || commits.next) && (
      <Paginator
        currentPage={paginator}
        disableNext={Boolean(commits.next) === false}
        disablePrevious={Boolean(commits.previous) === false}
        setPage={setPaginator}
      />
    );
  return (
    <>
      {renderPaginator()}
      <CommitsList commits={commits.results} />
      {renderPaginator()}
    </>
  );
};

export default CommitsListView;