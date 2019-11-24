import React from 'react';
import PropTypes from 'prop-types';

const Navbar = ({ children }) => {
  return (
    <nav className="navbar">
      <div className="navbar-list">
        {React.Children.map(children, (route) => {
          return <div className="navbar-item">{route}</div>;
        })}
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  children: PropTypes.arrayOf(PropTypes.element),
};

export default Navbar;
