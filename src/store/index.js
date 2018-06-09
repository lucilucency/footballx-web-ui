import {
  createStore,
  applyMiddleware,
  combineReducers,
  compose,
} from 'redux';
import thunkMiddleware from 'redux-thunk';
import {
  createResponsiveStoreEnhancer,
  createResponsiveStateReducer,
} from 'redux-responsive';
import { createLogger } from 'redux-logger';
import app from '../reducers';

const reducer = combineReducers({
  app,
  browser: createResponsiveStateReducer(null, {
    extraFields: () => ({
      width: window.innerWidth,
      height: window.innerHeight,
    }),
  }),
});
/* eslint-disable no-underscore-dangle */
// This enables the redux dev tools extension, or does nothing if not installed
const composeEnhancers = process.env.REACT_APP_DEBUG === 'true' ? (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose) : compose;
/* eslint-enable */
const middleware = [
  thunkMiddleware,
  process.env.REACT_APP_DEBUG === 'true' && createLogger(),
].filter(Boolean);
export default createStore(
  reducer,
  composeEnhancers(
    createResponsiveStoreEnhancer(),
    applyMiddleware(...middleware),
  ),
);
