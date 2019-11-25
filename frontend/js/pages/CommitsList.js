import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { creators } from '../store/ducks/commits';
import CommitsList from '../components/CommitsList';
import Paginator from '../components/Paginator';

const CommitsListPage = () => {
  const dispatch = useDispatch();
  const [paginator, setPaginator] = useState(0);
  useEffect(() => {
    // When the component loads (or the paginator changes), dispatch
    // an action to fetch the next 10 commits to display in the list.
    const action = creators.fetchCommits({ offset: paginator * 10 });
    dispatch(action);
  }, [paginator]);
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

export default CommitsListPage;
