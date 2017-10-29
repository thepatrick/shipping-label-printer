/* global document */

import React from 'react';
import ReactDOM from 'react-dom';

import { browserHistory } from 'react-router';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { createStore, applyMiddleware } from 'redux';
import { routerMiddleware, syncHistoryWithStore } from 'react-router-redux';

import 'bootstrap/dist/css/bootstrap.css';
import './index.css';

import reducers from './reducers';
import Router from './components/Router';

const logger = createLogger();
const middleware = [thunkMiddleware, routerMiddleware(browserHistory)];
if (process.env.NODE_ENV === 'development') {
  middleware.push(logger);
}

const store = createStore(
  reducers,
  applyMiddleware(...middleware),
);

const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render(<Router store={store} history={history} />, document.getElementById('root'));
