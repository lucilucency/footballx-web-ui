import React from 'react';
import { configure, addDecorator } from '@storybook/react';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import './styles.css';

import constants from '../src/components/constants';

const muiTheme = {
  fontFamily: constants.theme().fontFamily,
  card: { fontWeight: constants.fontWeightNormal },
  badge: { fontWeight: constants.fontWeightNormal },
  subheader: { fontWeight: constants.fontWeightNormal },
  raisedButton: { fontWeight: constants.fontWeightNormal },
  flatButton: { fontWeight: constants.fontWeightNormal },
  inkBar: {
    backgroundColor: constants.colorBlue,
  },
  palette: {
    textColor: constants.theme().textColorPrimary,
    primary1Color: constants.colorBlue,
    canvasColor: constants.theme().surfaceColorPrimary,
    borderColor: constants.theme().dividerColor,
  },
  tabs: {
    backgroundColor: constants.theme().surfaceColorPrimary,
    textColor: constants.theme().textColorPrimary,
    selectedTextColor: constants.theme().textColorPrimary,
  },
  button: { height: 38 },
};

addDecorator(story =>
  <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme, muiTheme)}>
    {story()}
  </MuiThemeProvider>
);

function loadStories() {
  require('../src/stories/index');
}

configure(loadStories, module);
