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
import { messaging, refreshToken } from './firebaseMessaging';
import store from './store';
import { getMetadata, refresh } from './actions';
import App from './components/App';
import ui from './theme';
import { getCookie } from './utils';
import registerServiceWorker from './registerServiceWorker';
// import { unregister } from './registerServiceWorker';

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
  font-family: ${ui.fontFamilyPrimary};
}

a {
  color: ${ui.linkColor};
  text-decoration: none;
  transition: ${ui.normalTransition};

  &:hover {
    color: color(${ui.linkColor} lightness(-33%));
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
  // background-color: ${ui.backgroundColorPrimary};
  // background-image: ${ui.backgroundImageColor};
  // color: ${ui.textColorPrimary};
}

[data-tip="true"] {
  cursor: help;
}

[data-id="tooltip"] {
  padding: 8px 12px !important;
  border-radius: 2px !important;
  background-color: ${ui.positive3Color} !important;
  color: ${ui.textColorPrimary} !important;
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

.text-colossal, .font-colossal { font-size: ${ui.fontSizeColossal}; line-height: 65px; }
.text-huge, .font-huge { font-size: ${ui.fontSizeHuge}; line-height: 48px; }
.text-big, .font-big { font-size: ${ui.fontSizeBig}; line-height: 36px; }
.text-large, .font-large { font-size: ${ui.fontSizeLarge}; line-height: 27px; }
.text-normal, .font-normal { font-size: ${ui.fontSizeNormal}; line-height: ${ui.lineHeightNormal}; }
.text-small, .font-small { font-size: ${ui.fontSizeSmall}; line-height: ${ui.lineHeightSmall}; }
.text-little, .font-little { font-size: ${ui.fontSizeLittle}; line-height: ${ui.lineHeightLittle}; }
.text-tiny, .font-tiny { font-size: ${ui.fontSizeTiny}; line-height: ${ui.lineHeightTiny}; }

.text-colossal,
.text-huge,
.text-big,
.text-large,
.text-normal,
.text-small,
.text-little,
.text-tiny {
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
    background-color: ${ui.backgroundColorPrimary};
    color: ${ui.textColorPrimary};
    border-radius: 2px;
    padding: 5px 8px;
    font-weight: ${ui.fontWeightLight};
    text-transform: none;
    font-size: ${ui.fontSizeNormal};
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
    border-color: ${ui.backgroundColorPrimary};
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
    border-color: transparent transparent ${ui.backgroundColorPrimary} transparent;
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
Amplitude.init(process.env.REACT_APP_AMP, null, {
  includeUtm: true,
});
Amplitude.setUserId(userID);
Amplitude.logEvent('Visit web');
/* init GA */
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

if (messaging) {
  refreshToken(messaging);
}

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
