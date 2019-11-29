import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar as BootstrapNavbar, Nav, Collapse, NavItem, NavLink, Container } from 'reactstrap';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGitAlt } from '@fortawesome/free-brands-svg-icons';

import Avatar from './Avatar';
import Toggler from './Toggler';

const Navbar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  return (
    <BootstrapNavbar className="custom-navbar" color="dark" dark expand="md">
      <Container>
        <Link className="navbar-brand" to="/">
          <FontAwesomeIcon fixedWidth icon={faGitAlt} size="lg" />
          <span>repo-monitor</span>
        </Link>
        <Toggler className="display-on-collapsed" isOpen={isOpen} onClick={toggle}>
          <Avatar />
        </Toggler>
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto" navbar>
            {React.Children.map(children, (el) => {
              // We inject the `nav-link` class so the element can act
              // as a NavLink and work properly with Bootstrap's navbar
              return <NavItem>{React.cloneElement(el, { className: 'nav-link' })}</NavItem>;
            })}
            <NavItem>
              <NavLink href="/logout">Sair</NavLink>
            </NavItem>
            <NavItem className="hidden-on-collapsed">
              <Avatar />
            </NavItem>
          </Nav>
        </Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

Navbar.propTypes = {
  children: PropTypes.node,
};

export default Navbar;
