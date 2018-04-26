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
    }),
  }),
});
/* eslint-disable no-underscore-dangle */
// This enables the redux dev tools extension, or does nothing if not installed
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
/* eslint-enable */
const middleware = process.env.REACT_APP_ENV === 'production' ? applyMiddleware(thunkMiddleware) : applyMiddleware(thunkMiddleware, createLogger());
export default createStore(
  reducer,
  composeEnhancers(
    createResponsiveStoreEnhancer(),
    applyMiddleware(thunkMiddleware),
    middleware,
  ),
);
