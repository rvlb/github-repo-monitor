import React from 'react';
import PropTypes from 'prop-types';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';

const Paginator = ({ currentPage, setPage, disablePrevious = false, disableNext = false }) => {
  const onClick = (value) => () => {
    setPage(value);
  };
  return (
    <Pagination className="paginator">
      <PaginationItem disabled={disablePrevious}>
        <PaginationLink previous onClick={onClick(currentPage - 1)} />
      </PaginationItem>
      <PaginationItem className="current-page" disabled>
        <PaginationLink>Página {currentPage + 1}</PaginationLink>
      </PaginationItem>
      <PaginationItem disabled={disableNext}>
        <PaginationLink next onClick={onClick(currentPage + 1)} />
      </PaginationItem>
    </Pagination>
  );
};

Paginator.propTypes = {
  currentPage: PropTypes.number.isRequired,
  setPage: PropTypes.func.isRequired,
  disablePrevious: PropTypes.bool,
  disableNext: PropTypes.bool,
};

export default Paginator;
