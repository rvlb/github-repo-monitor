import React from 'react';
import PropTypes from 'prop-types';

const Paginator = ({ currentPage, setPage, renderPrevious = true, renderNext = true }) => {
  const onClick = (value) => () => {
    setPage(value);
  };
  return (
    <div className="paginator">
      <div className="row">
        <div className="col previous-btn-wrapper">
          {renderPrevious && (
            <button type="button" onClick={onClick(currentPage - 1)}>
              Anterior
            </button>
          )}
        </div>
        <div className="col page-number-wrapper">Página {currentPage + 1}</div>
        <div className="col next-btn-wrapper">
          {renderNext && (
            <button type="button" onClick={onClick(currentPage + 1)}>
              Próximo
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

Paginator.propTypes = {
  currentPage: PropTypes.number.isRequired,
  setPage: PropTypes.func.isRequired,
  renderPrevious: PropTypes.bool,
  renderNext: PropTypes.bool,
};

export default Paginator;
