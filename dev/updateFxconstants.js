const fs = require('fs');

const request = require('superagent');

const mobileAPI = process.env.REACT_APP_API_HOST || 'https://api.ttab.me';
const webAPI = process.env.FX_WEB_API || 'https://web-api.ttab.me';
const v = process.env.FX_VERSION || 'v1';

const updateObjFile = (name, data) => {
  const json = data.reduce((json, value, key) => { json[value.id] = value; return json; }, {});
  const outputPath = `src/fxconstants/${name}Obj.json`;
  fs.writeFile(outputPath, JSON.stringify(json), 'utf8', () => {
    console.log(`${outputPath}: OK`);
  });
};

const updateArrFile = (name, data) => {
  const outputPath = `src/fxconstants/${name}Arr.json`;
  fs.writeFile(outputPath, JSON.stringify(data), 'utf8', () => {
    console.log(`${outputPath}: OK`);
  });
};

const getDownloadUrl = (delay, tries, error) => {
  const url = `${mobileAPI}/${v}/version`;

  if (tries < 1) {
    return null;
  }

  return request
    .get(url)
    .set('Content-Type', 'application/x-www-form-urlencoded')
    // .set('Authorization', `Bearer ${accessToken}`)
    .query({}) // query string
    .then((res, err) => {
      if (!err) {
        const dispatchData = res.body.data[0];
        return dispatchData.url;
      }
      return setTimeout(() => getDownloadUrl(delay + 2000, tries - 1, res.body.message), delay);
    })
    .catch((err) => {
      console.log(err);
      console.log(`Error in ${type}`);
      return null;
    });
};

request
  .post(`${webAPI}/${v}/content`)
  .set('Content-Type', 'application/x-www-form-urlencoded')
  .query({}) // query string
  .then((res, err) => {
    if (!err) {
      getDownloadUrl(1000, 3).then((nextUrl) => {
        request.get(nextUrl).buffer(true).then((res, err) => {
          const contentData = JSON.parse(res.text);
          const {
            clubs, areas, leagues, groups, group_membership_configs, exchange_rates, version,
          } = contentData;


          updateObjFile('clubs', clubs);
          updateObjFile('groups', groups);
          updateObjFile('leagues', leagues);
          updateObjFile('areas', areas);

          updateArrFile('clubs', clubs);
          updateArrFile('groups', groups);
          updateArrFile('leagues', leagues);
          updateArrFile('areas', areas);
        });
      });
    } else {
      return setTimeout(() => getDownloadUrl(delay + 2000, tries - 1, res.body.message), delay);
    }
  })
  .catch((err) => {
    console.log(err);
    console.log(`Error in ${type}`);
    return null;
  });

