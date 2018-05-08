/* global FX_API */
/* global FX_VERSION */
import queryString from 'querystring';
import { getCookie } from '../utils';

const request = require('superagent');
const FormUrlEncoded = require('form-urlencoded');

// eslint-disable-next-line import/prefer-default-export
export const ajaxGet = (path, params = {}, host = `${FX_API}/${FX_VERSION}`) => {
  const url = `${host}/${path}?${typeof params === 'string' ? params.substring(1) : queryString.stringify(params)}`;
  const accessToken = getCookie('access_token');

  const fetchDataWithRetry = (delay, tries, error) => {
    if (tries < 1) {
      console.error(error);
      console.error(`Error in ajaxGet/${path}`);
      return false;
    }
    return request
      .get(url)
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({}) // query string
      .catch((err) => {
        console.error(`Error in ajaxGet/${path}`);
        console.error(err);
        return setTimeout(() => fetchDataWithRetry(delay + 2000, tries - 1, err), delay);
      });
  };

  return fetchDataWithRetry(3000, 3);
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
