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
  return (
    <div>
      <CommitsList commits={commits.results} />
      <Paginator
        currentPage={paginator}
        renderNext={Boolean(commits.next)}
        renderPrevious={Boolean(commits.previous)}
        setPage={setPaginator}
      />
    </div>
  );
};

export default CommitsListView;
