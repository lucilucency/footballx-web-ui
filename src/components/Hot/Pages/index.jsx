import React from 'react';
import strings from 'lang';
import OverviewPage from './Overview';

const pages = [{
  name: strings.tab_hotspot_overview,
  key: 'overview',
  content: props => (<OverviewPage {...props} />),

}];

export default eventId => pages.map(page => ({
  ...page,
  route: `/event/${eventId}/${page.key.toLowerCase()}`,
  disabled: false,
}));
