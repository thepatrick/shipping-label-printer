import React from 'react';
import PropTypes from 'prop-types';
import Nav from './Nav';

const AppContainer = ({ children }) => (
  <div>
    <Nav />
    <div className="container-fluid">
      <div className="row">
        <main className="col-sm-9 ml-sm-auto col-md-10 pt-3" role="main">
          {children}
        </main>
      </div>
    </div>
  </div>
);

AppContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppContainer;

