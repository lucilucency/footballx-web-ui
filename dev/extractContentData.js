const request = require('superagent');

const API = process.env.REACT_APP_API_HOST;
const cmsAPI = process.env.REACT_APP_API_CMS;

const updateContentPath = `${cmsAPI}/v2/content`;
const client_ver = 1;

const extractContentData = new Promise((resolve) => {
  "use strict";
  console.log('Extracting content data');
  request
    .post(updateContentPath)
    .set({
      'Accept': 'application/json'
    })
    .send({
      client_ver
    })
    .then((res, err) => {
      console.log('res', res);
    });
});

extractContentData.then();

