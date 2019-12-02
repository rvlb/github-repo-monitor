import React from 'react';
import { Container } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGitAlt, faGithub } from '@fortawesome/free-brands-svg-icons';

const LoginView = () => {
  return (
    <Container className="d-flex justify-content-center">
      <div className="login-page-wrapper">
        <h1 className="app-title">
          <FontAwesomeIcon fixedWidth icon={faGitAlt} />
          <span>repo-monitor</span>
        </h1>
        <div>Monitore os commits dos seus repositórios do GitHub com apenas um clique!</div>
        <div className="login-btn-wrapper">
          <a className="btn btn-outline-dark" href="/oauth/login/github/">
            <span>Fazer login com o GitHub</span>
            <FontAwesomeIcon fixedWidth icon={faGithub} size="lg" />
          </a>
        </div>
      </div>
    </Container>
  );
};

export default LoginView;
