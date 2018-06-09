/* eslint-disable react/jsx-filename-extension */
import 'core-js/fn/object/values';
import React from 'react';
import createHistory from 'history/createBrowserHistory';
// import ReactGA from 'react-ga';
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
// import registerServiceWorker from './registerServiceWorker';
import { unregister } from './registerServiceWorker';

// Inject global style
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
  color: ${constants.theme().linkColor};
  text-decoration: none;
  transition: ${constants.normalTransition};

  &:hover {
    color: color(${constants.theme().linkColor} lightness(-33%));
    opacity: 0.6;
  }
}

li {
  list-style-type: none;
}

#root {
  height: 100%;
  overflow-x: hidden;
  min-height: 100vh;
  background-color: ${constants.theme().backgroundColorPrimary};
  background-image: ${constants.theme().backgroundColorSecondary};
  color: ${constants.theme().textColorPrimary};
}

[data-tip="true"] {
  cursor: help;
}

[data-id="tooltip"] {
  padding: 8px 12px !important;
  border-radius: 2px !important;
  background-color: ${constants.theme().backgroundColorPrimary} !important;
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

h1 { font-size: 50px; line-height: 65px; }
h2 { font-size: 37px; line-height: 48px; }
h3 { font-size: 28px; line-height: 36px; }
h4 { font-size: 21px; line-height: 27px; }
h5 { font-size: 16px; line-height: 21px; }
h6 { font-size: 14px; line-height: 18px; }
h7 { font-size: 12px; line-height: 16px; display: block; }
h1, h2, h3, h4, h5, h6, h7 {
  -webkit-margin-before: 1em; -webkit-margin-after: 1em; 
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
    background-color: ${constants.theme().backgroundColorPrimary};
    color: ${constants.theme().textColorPrimary};
    border-radius: 2px;
    padding: 5px 8px;
    font-weight: ${constants.fontWeightLight};
    text-transform: none;
    font-size: ${constants.fontSizeNormal};
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
    border-color: ${constants.theme().backgroundColorPrimary};
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
    border-color: transparent transparent ${constants.theme().backgroundColorPrimary} transparent;
    bottom: -3px;
  }
}
`]);


const userID = getCookie('user_id');
if (userID) {
  store.dispatch(getMetadata());
  store.dispatch(refresh(userID));
}

/* init amplitude */
Amplitude.init(process.env.REACT_APP_AMP);
Amplitude.setUserId(userID);
Amplitude.logEvent('Visit web');

const history = createHistory();

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
// registerServiceWorker();
unregister();
// document.getElementById('loader').style.display = 'none';
