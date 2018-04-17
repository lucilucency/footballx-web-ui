/* eslint-disable global-require */
export const langs = [{
  value: 'en-US',
  native: 'English (US)',
  data: require('./en-US.json'),
}, {
  value: 'vi-VN',
  native: 'Tiếng Việt',
  data: require('./vi-VN.json'),
}];
const savedLang = window.localStorage && window.localStorage.getItem('localization');
const langToUse = (langs.filter(o => o).find(lang => lang.value === savedLang) || langs[0]).data;
export default langToUse;
