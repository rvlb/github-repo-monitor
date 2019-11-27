import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Navbar as BootstrapNavbar,
  NavbarToggler,
  Nav,
  Collapse,
  NavItem,
  Container,
} from 'reactstrap';
import PropTypes from 'prop-types';

const Navbar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  return (
    <BootstrapNavbar className="custom-navbar" color="dark" dark expand="md">
      <Container>
        <Link className="navbar-brand" to="/">
          Repo Monitor
        </Link>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto" navbar>
            {React.Children.map(children, (el) => {
              // We inject the `nav-link` class so the element can act
              // as a NavLink and work properly with Bootstrap's navbar
              return <NavItem>{React.cloneElement(el, { className: 'nav-link' })}</NavItem>;
            })}
          </Nav>
        </Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

Navbar.propTypes = {
  children: PropTypes.arrayOf(PropTypes.element),
};

export default Navbar;
