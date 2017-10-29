import React from 'react';
import PropTypes from 'prop-types';

import { Provider } from 'react-redux';
import { Router, Route, IndexRoute } from 'react-router';

import AppContainer from './AppContainer';
import ChooseLabel from './ChooseLabel';

import FromLabel from './labels/FromLabel';

// const NoMatchComponent = () => <h1>Not found :(</h1>;

const Root = ({ store, history }) => (
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={AppContainer}>
        <IndexRoute component={ChooseLabel} />
        <Route path="/from-label" component={FromLabel} />
      </Route>
    </Router>
  </Provider>
);

Root.propTypes = {
  store: PropTypes.shape({}).isRequired,
  history: PropTypes.shape({}).isRequired,
};

export default Root;
