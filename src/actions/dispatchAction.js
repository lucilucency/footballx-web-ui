/* eslint-disable no-restricted-syntax,guard-for-in */
import queryString from 'querystring';
import update from 'react-addons-update';

const request = require('superagent');
const FormUrlEncoded = require('form-urlencoded');

const FX_API = process.env.REACT_APP_API_HOST;
const FX_VERSION = process.env.REACT_APP_VERSION;

export function dispatchPost(type, path, params = {}, transform, payload) {
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

    const options = { method: 'POST' };
    if (typeof params === 'object') {
      options.body = FormUrlEncoded(params);
      options.contentType = 'application/x-www-form-urlencoded';
    }

    const accessToken = localStorage.getItem('access_token') || '';

    const fetchDataWithRetry = (delay, tries, error) => {
      if (tries < 1) {
        return dispatchAction(dispatchFail(error));
      }
      return request
        .post(url)
        .send(options.body)
        .set('Content-Type', options.contentType)
        .set('Authorization', `Bearer ${accessToken}`)
        .query({}) // query string
        .then((res) => {
          if (res.statusCode === 200) {
            let dispatchData = JSON.parse(res.text);
            if (transform) {
              dispatchData = transform(dispatchData);
            }
            if (payload) {
              console.log('payload', payload);

              if (Array.isArray(payload)) {
                dispatchData = payload;
              } else {
                dispatchData = update(dispatchData, {
                  $merge: payload,
                });
              }
            }

            return dispatchAction(dispatchOK(dispatchData));
          }
          return setTimeout(() => fetchDataWithRetry(delay + 2000, tries - 1, res.error), delay);
        })
        .catch((err) => {
          console.error(`Error in dispatchPost/${type}`);
          if (err.message === 'Unauthorized') {
            localStorage.removeItem('access_token');
            localStorage.removeItem('user_id');
            // window.location.href = '/login';
            return null;
          }

          return dispatchAction(dispatchFail(err.message));
        });
    };

    dispatchAction(dispatchStart());
    return fetchDataWithRetry(1000, 1);
  };
}

export function dispatch(type, payload, transform) {
  return (dispatchAction) => {
    const dispatchOK = payload => ({
      type: `OK/${type}`,
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

    const accessToken = localStorage.getItem('access_token');
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
          console.error(`Error in dispatchGet/${type}`);
          if (err.message === 'Unauthorized') {
            localStorage.removeItem('access_token');
            localStorage.removeItem('user_id');
            // window.location.href = '/';
            return null;
          }

          return dispatchAction(dispatchFail(err.response ? err.response.body.message : err));
        });
    };

    dispatchAction(dispatchStart());
    return fetchDataWithRetry(1000, 1);
  };
}

export function dispatchPut(type, path, params = {}, transform) {
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

    const options = { method: 'PUT' };


    if (typeof params === 'object') {
      options.body = FormUrlEncoded(params);
      options.contentType = 'application/x-www-form-urlencoded';
    }

    const accessToken = localStorage.getItem('access_token') || '';

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

            return dispatchAction(dispatchOK(dispatchData));
          }
          return setTimeout(() => fetchDataWithRetry(delay + 2000, tries - 1, res.error), delay);
        })
        .catch((err) => {
          console.error(`Error in dispatchPut/${type}`);
          return dispatchAction(dispatchFail(err.message));
        });
    };

    dispatchAction(dispatchStart());
    return fetchDataWithRetry(1000, 1);
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
      options.body = FormUrlEncoded(params);
      options.contentType = 'application/x-www-form-urlencoded';
    }

    const accessToken = localStorage.getItem('access_token') || '';

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
