/* eslint-disable no-shadow */
import queryString from 'querystring';
import update from 'react-addons-update';
import formurlencoded from 'form-urlencoded';
import { getCookie, eraseCookie } from '../utils';

const request = require('superagent');

const FX_API = process.env.REACT_APP_API_HOST;
const FX_VERSION = process.env.REACT_APP_VERSION;

export function dispatch({
  reducer,
  payload,
  transform,
}) {
  return (dispatchAction) => {
    const dispatchOK = payload => ({
      type: `OK/${reducer}`,
      payload,
    });
    const dispatchData = transform ? transform(payload) : payload;
    return dispatchAction(dispatchOK(dispatchData));
  };
}

export function dispatchGet(type, path, params = {}, transform) {
  const host = FX_API;
  const v = FX_VERSION;
  return (dispatchAction) => {
    const url = `${host}/${v}/${path}?${typeof params === 'string' ? params.substring(1) : queryString.stringify(params)}`;

    const dispatchStart = () => ({
      type: `REQUEST/${type}`,
    });
    const dispatchOK = payload => ({
      type: `OK/${type}`,
      payload,
    });
    const dispatchFail = error => ({
      type: `FAIL/${type}`,
      error,
    });

    const accessToken = getCookie('access_token');
    const fetchDataWithRetry = (delay, tries, error) => {
      if (tries < 1) {
        return dispatchFail(error);
      }
      return request
        .get(url)
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('Authorization', `Bearer ${accessToken}`)
        .query({}) // query string
        .then((res) => {
          if (res.statusCode === 200) {
            let dispatchData = JSON.parse(res.text);
            if (transform) {
              dispatchData = transform(dispatchData);
            }
            return dispatchAction(dispatchOK(dispatchData));
          }
          return setTimeout(() => fetchDataWithRetry(delay + 2000, tries - 1, res.body.message), delay);
        })
        .catch((err) => {
          console.warn(`Error in dispatchGet/${type}`);
          console.error(err);
          if (err.message === 'Unauthorized') {
            console.warn('Unauthorized, logging out...');
            eraseCookie('user_id');
            eraseCookie('username');
            eraseCookie('access_token');
            window.location.href = '/';
            return null;
          }

          return dispatchAction(dispatchFail(err.response ? err.response.body.message : err));
        });
    };

    dispatchAction(dispatchStart());
    return fetchDataWithRetry(1000, 1);
  };
}

export function dispatchPOST({
  auth = true,
  host = FX_API,
  version = FX_VERSION,
  contentType = 'application/x-www-form-urlencoded',
  retries = 1,
  retriesBreak = 3000,
  reducer,
  path,
  params = {},
  transform,
  payload,
  reducerCallback,
  payloadCallback,
  callback,
}) {
  return (dispatchAction) => {
    const url = `${host}/${version}/${path}?${typeof params === 'string' ? params.substring(1) : ''}`;

    const dispatchStart = () => ({
      type: `REQUEST/${reducer}`,
    });
    const dispatchOK = payload => ({
      type: `OK/${reducer}`,
      payload,
    });
    const dispatchCallbackOK = payload => ({
      type: `OK/${reducerCallback}`,
      payload,
    });
    const dispatchFail = error => ({
      type: `FAIL/${reducer}`,
      error,
    });

    const accessToken = getCookie('access_token');

    const fetchDataWithRetry = (delay, tries, error) => {
      if (tries < 1) {
        return dispatchAction(dispatchFail(error));
      }

      let doRequest = request
        .post(url)
        .set('Content-Type', contentType);
      if (auth) {
        doRequest = doRequest.set('Authorization', `Bearer ${accessToken}`);
      }

      return doRequest
        .send(formurlencoded(params))
        .query({}) // query string
        .then((res) => {
          if (res.statusCode === 200) {
            let dispatchData = JSON.parse(res.text);
            if (transform) {
              dispatchData = transform(dispatchData);
            }
            if (payload) {
              if (Array.isArray(payload)) {
                dispatchData = payload;
              } else {
                dispatchData = update(dispatchData, {
                  $merge: payload,
                });
              }
            }
            if (callback) callback(dispatchData);
            if (reducerCallback) {
              dispatchAction(dispatchCallbackOK(payloadCallback));
            }
            return dispatchAction(dispatchOK(dispatchData));
          }
          return setTimeout(() => fetchDataWithRetry(delay + 2000, tries - 1, res.error), delay);
        })
        .catch((err) => {
          console.error(`Error in dispatchPost/${reducer}`);
          if (err.message === 'Unauthorized') {
            console.error('Unauthorized, logging out...');
            // window.location.href = '/login';
            return null;
          }

          return dispatchAction(dispatchFail(err.message));
        });
    };

    dispatchAction(dispatchStart());
    return fetchDataWithRetry(retriesBreak, retries);
  };
}

export function dispatchGET({
  auth = true,
  host = FX_API,
  version = FX_VERSION,
  reducer,
  path,
  params = {},
  transform,
  retries = 1,
  retriesBreak = 3000,
  callback,
}) {
  return (dispatchAction) => {
    const url = `${host}/${version}/${path}?${typeof params === 'string' ? params.substring(1) : queryString.stringify(params)}`;

    const dispatchStart = () => ({
      type: `REQUEST/${reducer}`,
    });
    const dispatchOK = payload => ({
      type: `OK/${reducer}`,
      payload,
    });
    const dispatchFail = error => ({
      type: `FAIL/${reducer}`,
      error,
    });

    const accessToken = getCookie('access_token');

    const fetchDataWithRetry = (delay, tries = 1, error) => {
      if (tries < 1) {
        return dispatchFail(error);
      }

      let doRequest = request
        .get(url)
        .set('Content-Type', 'application/x-www-form-urlencoded');
      if (auth) {
        doRequest = doRequest.set('Authorization', `Bearer ${accessToken}`);
      }

      return doRequest
        .query({}) // query string
        .then((res) => {
          if (res.statusCode === 200) {
            let dispatchData = JSON.parse(res.text);
            if (transform) {
              dispatchData = transform(dispatchData);
            }
            if (callback) callback(dispatchData);
            return dispatchAction(dispatchOK(dispatchData));
          }
          return setTimeout(() => fetchDataWithRetry(delay + 2000, tries - 1, res.body.message), delay);
        })
        .catch((err) => {
          console.warn(`Error in dispatchGet/${reducer}`);
          console.error(err);
          if (err.message === 'Unauthorized') {
            console.warn('Unauthorized, logging out...');
            eraseCookie('user_id');
            eraseCookie('username');
            eraseCookie('access_token');
            window.location.href = '/';
            return null;
          }

          return dispatchAction(dispatchFail(err.response ? err.response.body.message : err));
        });
    };

    dispatchAction(dispatchStart());
    return fetchDataWithRetry(retriesBreak, retries);
  };
}

export function dispatchPUT({
  host = FX_API,
  version = FX_VERSION,
  reducer,
  path,
  params = {},
  transform,
  retries = 1,
  retriesBreak = 3000,
  callback,
}) {
  return (dispatchAction) => {
    const url = `${host}/${version}/${path}?${typeof params === 'string' ? params.substring(1) : ''}`;

    const dispatchStart = () => ({
      type: `REQUEST/${reducer}`,
    });
    const dispatchOK = payload => ({
      type: `OK/${reducer}`,
      payload,
    });
    const dispatchFail = error => ({
      type: `FAIL/${reducer}`,
      error,
    });

    const options = { method: 'PUT' };

    if (typeof params === 'object') {
      options.body = formurlencoded(params);
      options.contentType = 'application/x-www-form-urlencoded';
    }

    const accessToken = getCookie('access_token');

    const fetchDataWithRetry = (delay, tries, error) => {
      if (tries < 1) {
        return dispatchFail(error);
      }
      return request
        .put(url)
        .send(options.body)
        .set('Content-Type', options.contentType)
        .set('Authorization', `Bearer ${accessToken}`)
        .then((res) => {
          if (res.statusCode === 200) {
            let dispatchData = JSON.parse(res.text);
            if (transform) {
              dispatchData = transform(dispatchData);
            }

            if (callback) callback(dispatchData);
            return dispatchAction(dispatchOK(dispatchData));
          }
          return setTimeout(() => fetchDataWithRetry(delay, tries - 1, res.error), delay);
        })
        .catch((err) => {
          console.error(`Error in dispatchPut/${reducer}`);
          return dispatchAction(dispatchFail(err.message));
        });
    };

    dispatchAction(dispatchStart());
    return fetchDataWithRetry(retriesBreak, retries);
  };
}

export function dispatchDelete(type, path, params = {}, transform) {
  const host = FX_API;
  const v = FX_VERSION;
  return (dispatchAction) => {
    const url = `${host}/${v}/${path}?${typeof params === 'string' ? params.substring(1) : ''}`;

    const dispatchStart = () => ({
      type: `REQUEST/${type}`,
    });
    const dispatchOK = payload => ({
      type: `OK/${type}`,
      payload,
    });
    const dispatchFail = error => ({
      type: `FAIL/${type}`,
      error,
    });

    const options = { method: 'DELETE' };

    if (typeof params === 'object') {
      options.body = formurlencoded(params);
      options.contentType = 'application/x-www-form-urlencoded';
    }

    const accessToken = getCookie('access_token');

    const fetchDataWithRetry = (delay, tries, error) => {
      if (tries < 1) {
        return dispatchFail(error);
      }
      return request
        .delete(url)
        .send(options.body || {})
        .set('Content-Type', options.contentType)
        .set('Authorization', `Bearer ${accessToken}`)
        .then((res, err) => {
          if (!err) {
            let dispatchData = res.body.data;
            if (transform) {
              dispatchData = transform(res.body.data);
            }
            return dispatchAction(dispatchOK(dispatchData));
          }
          // return setTimeout(() => fetchDataWithRetry(delay + 2000, tries - 1, res.body.message), delay);
          return dispatchAction(dispatchFail(res.body.message));
        })
        .catch((err) => {
          console.error(`Error in ${type}`);
          return dispatchAction(dispatchFail((err.response && err.response.body) ? err.response.body.message : err));
        });
    };

    dispatchAction(dispatchStart());
    return fetchDataWithRetry(1000, 1);
  };
}
