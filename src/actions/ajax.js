import queryString from 'querystring';
import formurlencoded from 'form-urlencoded';
import { getCookie } from '../utils';

const request = require('superagent');

const FX_API = process.env.REACT_APP_API_HOST;
const FX_VERSION = process.env.REACT_APP_VERSION;

// eslint-disable-next-line import/prefer-default-export
export const ajaxGet = ({
  auth = false,
  host = FX_API,
  version = FX_VERSION,
  path,
  url,
  contentType = 'application/x-www-form-urlencoded',
  retries = 1,
  retriesBreak = 3000,
  params = {},
}, callback) => {
  const queryUrl = url || `${host}/${version}/${path}`;
  const queryUrlWithParams = `${queryUrl}?${typeof params === 'string' ? params.substring(1) : queryString.stringify(params)}`;

  const fetchDataWithRetry = (delay, tries, error) => {
    if (tries < 1) {
      console.error(error);
      console.error(`Error in ajaxGet/${path}`);
      if (callback) return callback(null);
      return null;
    }

    let doRequest = request
      .get(queryUrlWithParams)
      .set('Content-Type', contentType);
    if (auth) {
      const accessToken = getCookie('access_token');
      doRequest = doRequest.set('Authorization', `Bearer ${accessToken}`);
    }

    return doRequest
      .end((err, res) => {
        if (res) {
          if (res.ok && res.text) {
            if (callback) return callback(res.text);
            return res.text;
          }
          return setTimeout(() => fetchDataWithRetry(delay + 2000, tries - 1), delay);
        }
        console.error(`Error in ajaxGet/${path}`);
        console.error(err);
        return setTimeout(() => fetchDataWithRetry(delay + 2000, tries - 1, err), delay);
      });
  };

  return fetchDataWithRetry(retriesBreak, retries);
};

export const ajaxPost = ({
  auth = true, host = FX_API, version = FX_VERSION, path, url,
  contentType = 'application/x-www-form-urlencoded',
  params = {},
  retries = 1, retriesBreak = 3000,
}, callback) => {
  const queryUrl = url || `${host}/${version}/${path}`;
  // const queryUrlWithParams = `${queryUrl}?${typeof params === 'string' ? params.substring(1) : queryString.stringify(params)}`;

  const fetchDataWithRetry = (delay, tries, error) => {
    if (tries < 1) {
      console.error(error);
      console.error(`Error in ajaxGet/${path}`);
      if (callback) return callback(null);
      return null;
    }

    let doRequest = request
      .post(queryUrl)
      .set('Content-Type', contentType);
    if (auth) {
      const accessToken = getCookie('access_token');
      doRequest = doRequest.set('Authorization', `Bearer ${accessToken}`);
    }

    return doRequest
      .send(formurlencoded(params))
      .then((res, err) => {
        if (callback) return callback(err, res);
        if (res) {
          if (res.ok && res.body) {
            return res.body;
          }
        }
        console.error(`Error in ajaxPost/${path}`);
        console.error(err);
        return setTimeout(() => fetchDataWithRetry(delay + 2000, tries - 1, err), delay);
      });
  };

  return fetchDataWithRetry(retriesBreak, retries);
};

export const ajaxPut = ({
  auth = true, host = FX_API, version = FX_VERSION, path, url,
  contentType = 'application/x-www-form-urlencoded',
  params = {},
  retries = 1, retriesBreak = 3000,
}, callback) => {
  const queryUrl = url || `${host}/${version}/${path}`;

  const fetchDataWithRetry = (delay, tries, error) => {
    if (tries < 1) {
      console.error(error);
      console.error(`Error in ajaxGet/${path}`);
      if (callback) return callback(null);
      return null;
    }

    let doRequest = request
      .put(queryUrl)
      .set('Content-Type', contentType);
    if (auth) {
      const accessToken = getCookie('access_token');
      doRequest = doRequest.set('Authorization', `Bearer ${accessToken}`);
    }

    return doRequest
      .send(formurlencoded(params))
      .end((err, res) => {
        if (callback) return callback(err, res);

        if (res) {
          if (res.ok && res.text) {
            return res.text;
          }
          return setTimeout(() => fetchDataWithRetry(delay + 2000, tries - 1), delay);
        }
        console.error(`Error in ajaxGet/${path}`);
        console.error(err);
        return setTimeout(() => fetchDataWithRetry(delay + 2000, tries - 1, err), delay);
      });
  };

  return fetchDataWithRetry(retriesBreak, retries);
};


export const ajaxUpload = ({
  // auth = true,
  host = 'https://upload-api.ttab.me',
  version = 'v1',
  path = 'upload-image',
  params = {},
  file,
}, callback) => {
  const url = `${host}/${version}/${path}?${typeof params === 'string' ? params.substring(1) : queryString.stringify(params)}`;
  // const accessToken = getCookie('access_token');

  const formData = new FormData();
  formData.append('file', file);

  const fetchDataWithRetry = (delay, tries, error) => {
    if (tries < 1) {
      console.error(error);
      console.error(`Error in ajaxGet/${path}`);
      if (callback) callback(null);
      return null;
    }
    return request
      .post(url)
      .attach('file', file)
      // .catch((err) => {
      //   console.error(`Error in ajaxUpload/${path}`);
      //   console.error(err);
      //   return setTimeout(() => fetchDataWithRetry(delay, tries - 1, err), delay);
      // });
      .end((err, res) => {
        if (res) {
          if (res.ok && res.text) {
            if (callback) return callback(res.text);
            return res.text;
          }
          return setTimeout(() => fetchDataWithRetry(delay + 2000, tries - 1), delay);
        }
        console.error(`Error in ajaxGet/${path}`);
        console.error(err);
        return setTimeout(() => fetchDataWithRetry(delay + 2000, tries - 1, err), delay);
      });
  };

  return fetchDataWithRetry(3000, 1);
};
