import queryString from 'querystring';
import { getCookie } from '../utils';

const request = require('superagent');
const FormUrlEncoded = require('form-urlencoded');

const FX_API = process.env.REACT_APP_API_HOST;
const FX_VERSION = process.env.REACT_APP_VERSION;

// eslint-disable-next-line import/prefer-default-export
export const ajaxGet = ({
  auth = false,
  host = FX_API,
  version = FX_VERSION,
  url,
  contentType = 'application/x-www-form-urlencoded',
  retries = 1,
  retriesBreak = 3000,
  path,
  params = {},
}) => {
  const queryUrl = url || `${host}/${version}/${path}`;
  const queryUrlWithParams = `${queryUrl}?${typeof params === 'string' ? params.substring(1) : queryString.stringify(params)}`;

  const fetchDataWithRetry = (delay, tries, error) => {
    if (tries < 1) {
      console.error(error);
      console.error(`Error in ajaxGet/${path}`);
      return false;
    }

    let doRequest = request
      .get(queryUrlWithParams)
      .set('Content-Type', contentType);
    if (auth) {
      const accessToken = getCookie('access_token');
      doRequest = doRequest.set('Authorization', `Bearer ${accessToken}`);
    }

    return doRequest
      .query({}) // query string
      .catch((err) => {
        console.error(`Error in ajaxGet/${path}`);
        console.error(err);
        return setTimeout(() => fetchDataWithRetry(delay + 2000, tries - 1, err), delay);
      });
  };

  return fetchDataWithRetry(retriesBreak, retries);
};

// eslint-disable-next-line import/prefer-default-export
export const ajaxPost = (path, params = {}, host = `${FX_API}/${FX_VERSION}`) => {
  const url = `${host}/${path}?${typeof params === 'string' ? params.substring(1) : queryString.stringify(params)}`;
  const accessToken = getCookie('access_token');

  const fetchDataWithRetry = (delay, tries, error) => {
    if (tries < 1) {
      console.error(error);
      console.error(`Error in ajaxGet/${path}`);
      return false;
    }
    return request
      .post(url)
      .send(FormUrlEncoded(params))
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({}) // query string
      .catch((err) => {
        console.error(`Error in ajaxPost/${path}`);
        console.error(err);
        return setTimeout(() => fetchDataWithRetry(delay + 2000, tries - 1, err), delay);
      });
  };

  return fetchDataWithRetry(3000, 3);
};

// eslint-disable-next-line import/prefer-default-export
export const ajaxPut = (path, params = {}, host = `${FX_API}/${FX_VERSION}`) => {
  const url = `${host}/${path}?${typeof params === 'string' ? params.substring(1) : queryString.stringify(params)}`;
  const accessToken = getCookie('access_token');

  const fetchDataWithRetry = (delay, tries, error) => {
    if (tries < 1) {
      console.error(error);
      console.error(`Error in ajaxGet/${path}`);
      return false;
    }
    return request
      .put(url)
      .send(FormUrlEncoded(params))
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({}) // query string
      .catch((err) => {
        console.error(`Error in ajaxPost/${path}`);
        console.error(err);
        return setTimeout(() => fetchDataWithRetry(delay + 2000, tries - 1, err), delay);
      });
  };

  return fetchDataWithRetry(3000, 3);
};

export const ajaxUpload = ({
  // auth = true,
  host = 'https://upload-api.ttab.me',
  version = 'v1',
  path = 'upload-image',
  params = {},
  file,
}) => {
  const url = `${host}/${version}/${path}?${typeof params === 'string' ? params.substring(1) : queryString.stringify(params)}`;
  // const accessToken = getCookie('access_token');

  const formData = new FormData();
  formData.append('file', file);

  const fetchDataWithRetry = (delay, tries, error) => {
    if (tries < 1) {
      console.error(error);
      console.error(`Error in ajaxGet/${path}`);
      return false;
    }
    return request
      .post(url)
      .attach('file', file)
      // .set('Content-Type', 'multipart/form-data')
      // .set('Authorization', `Bearer ${accessToken}`)
      // .set('Content-Type', false)
      // .set('Process-Data', false)
      // .send(formData)
      .catch((err) => {
        console.error(`Error in ajaxUpload/${path}`);
        console.error(err);
        return setTimeout(() => fetchDataWithRetry(delay, tries - 1, err), delay);
      });
  };

  return fetchDataWithRetry(3000, 1);
};
