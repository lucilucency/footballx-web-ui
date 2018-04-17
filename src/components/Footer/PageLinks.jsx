import React from 'react';
import strings from '../../lang';

const links = [{
  name: strings.app_about,
  path: '//about',
}, {
  name: strings.app_privacy_terms,
  path: '//privacy',
}, {
  name: strings.app_api_docs,
  path: '//docs',
}, {
  name: strings.app_blog,
  path: '//blog',
}, {
  name: strings.app_translate,
  path: '//translate',
}, {
  name: strings.app_gravitech,
  path: '//www.gravitech.io',
}];

export default () => links.map(link => (
  <a href={link.path} key={link.name} target="_blank" rel="noopener noreferrer">{link.name}</a>
));
