import React from 'react';
import { Container } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCode, faHeart } from '@fortawesome/free-solid-svg-icons';

const Footer = () => (
  <Container>
    <footer className="footer">
      <div>
        Made with <FontAwesomeIcon fixedWidth icon={faCode} />
        {' & '}
        <FontAwesomeIcon fixedWidth icon={faHeart} />
      </div>
      <div>@rvlb-19 - 2019</div>
    </footer>
  </Container>
);

export default Footer;
