/* eslint-disable react/jsx-filename-extension */
import 'core-js/fn/object/values';
import React from 'react';
import createHistory from 'history/createBrowserHistory';
import ReactGA from 'react-ga';
import { hydrate, render } from 'react-dom';
import { Provider } from 'react-redux';
import { Route, Router } from 'react-router-dom';
import { injectGlobal } from 'styled-components';
import Amplitude from 'react-amplitude';
import store from './store';
import { getMetadata, refresh } from './actions';
import App from './components/App';
import constants from './components/constants';
import { getCookie } from './utils';
import registerServiceWorker from './registerServiceWorker';
// import { unregister } from './registerServiceWorker';

// Inject global styles
injectGlobal([`
body {
  background-color: initial;
  text-align: initial;
  display: initial;
  justify-content: initial;
  align-items: initial;
  height: initial;
  width: initial;
  margin: 0;
  font-family: ${constants.theme().fontFamily};
}

a {
  color: ${constants.theme().linkColorPrimary};
  text-decoration: none;
  transition: ${constants.normalTransition};

  &:hover {
    color: color(${constants.theme().linkColorPrimary} lightness(-33%));
  }
}

li {
  list-style-type: none;
}

#root {
  height: 100%;
  overflow-x: hidden;
  min-height: 100vh;
  background-color: ${constants.theme().backgroundColor};
  background-image: ${constants.theme().backgroundColorSecondary};
  color: ${constants.theme().textColorPrimary};
}

[data-tip="true"] {
  cursor: help;
}

[data-id="tooltip"] {
  padding: 8px 12px !important;
  border-radius: 2px !important;
  background-color: ${constants.theme().backgroundColor} !important;
  color: ${constants.theme().textColorPrimary} !important;
  white-space: pre-wrap;
  line-height: 1.5 !important;
  text-align: left;
  margin: -3px !important;

  &:matches(::after, ::before) {
    content: none !important;
  }
}

@keyframes tooltip-appear {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

[data-hint] {
  &::before,
  &::after {
    position: absolute;
    display: inline-block;
    opacity: 0;
    z-index: 10000;
    pointer-events: none;
  }

  &::before {
    content: "";
    width: 0;
    height: 0;
  }

  &::after {
    content: attr(data-hint);
    background-color: ${constants.theme().backgroundColor};
    color: ${constants.theme().textColorPrimary};
    border-radius: 2px;
    padding: 5px 8px;
    font-weight: ${constants.fontWeightLight};
    text-transform: none;
    font-size: ${constants.fontSizeMedium};
    line-height: 1.3;
    white-space: nowrap;
  }

  &:hover {
    cursor: help;

    &::before,
    &::after {
      animation-name: tooltip-appear;
      animation-duration: 0.1s;
      animation-fill-mode: forwards;
      animation-timing-function: ease-in;
      animation-delay: 0.4s;
    }
  }
}

[data-hint-position="top"] {
  &::after {
    bottom: 100%;
    margin-bottom: 3px;
    margin-left: -24px;
  }

  &::before {
    border-style: solid;
    border-width: 3px 6px 0 6px;
    border-color: ${constants.theme().backgroundColor};
    top: -3px;
  }
}

[data-hint-position="bottom"] {
  &::after {
    top: 100%;
    margin-top: 3px;
    margin-left: -24px;
  }

  &::before {
    border-style: solid;
    border-width: 0 6px 3px 6px;
    border-color: transparent transparent ${constants.theme().almostColor} transparent;
    bottom: -3px;
  }
}
`]);

// Fetch metadata (used on all pages)
// const userID = localStorage.getItem('user_id');
const userID = getCookie('user_id');
if (userID) {
  store.dispatch(getMetadata());
  store.dispatch(refresh(userID));
}

Amplitude.init('07108ecf4fba17b59856950d78ce36bb');
Amplitude.setUserId(userID);
Amplitude.logEvent('ENTER_WEB_APP');

ReactGA.initialize(process.env.REACT_APP_GA, {
  gaOptions: {
    userId: userID,
  },
});
ReactGA.pageview(window.location.pathname + window.location.search);
const history = createHistory();
history.listen((location) => {
  ReactGA.pageview(location.pathname);
});

const rootElement = document.getElementById('root');
const app = (
  <Provider store={store}>
    <Router history={history}>
      <Route component={App} />
    </Router>
  </Provider>);
if (rootElement.hasChildNodes()) {
  render(app, rootElement);
} else {
  hydrate(app, rootElement);
}
registerServiceWorker();
// unregister();
// document.getElementById('loader').style.display = 'none';
